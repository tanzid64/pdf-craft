import { auth } from "@/auth";
import { ChatWrapper } from "@/components/chat-wrapper";
import { PdfRenderer } from "@/components/pdf-renderer";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { FC } from "react";

interface FilePageProps {
  params: { fileid: string };
}

const FilePage: FC<FilePageProps> = async ({ params }) => {
  const { fileid } = params;
  const session = await auth();
  const user = session?.user;
  if (!session?.user?.id) {
    notFound();
  }
  if (!user || !user.id) redirect(`/auth/sign-in`);

  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id,
    },
  });

  if (!file) notFound();


  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* Main area */}
            <PdfRenderer url={file?.url!} />
          </div>
        </div>

        {/* Right sidebar & Chat wrapper */}
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={file.url} />
        </div>
      </div>
    </div>
  );
};

export default FilePage;
