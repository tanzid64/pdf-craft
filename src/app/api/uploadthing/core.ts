import { auth } from "@/auth";
import { db } from "@/lib/db";
import { pineconeIndex } from "@/lib/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const session = await auth();
      const user = session?.user;
      console.log(user);

      if (!user || !user.id) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.url,
          uploadStatus: "PROCESSING",
        },
      });

      // Process the file with the OpenAI Embeddings while uploading
      try {
        const respone = await fetch(file.url);
        const blob = await respone.blob();

        const loader = new PDFLoader(blob); // load in the memory to work with the file
        const pageLevelDocs = await loader.load();

        pageLevelDocs.length;

        // vectorize & indexing the document
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
        });

        // const embeddings = new GoogleGenerativeAIEmbeddings({
        //   apiKey: process.env.GOOGLE_API_KEY!,
        // });

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createFile.id,
        });

        await db.file.update({
          where: { id: createFile.id },
          data: { uploadStatus: "SUCCESS" },
        });
      } catch (error) {
        console.log(error);
        await db.file.update({
          where: { id: createFile.id },
          data: { uploadStatus: "FAILED" },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
