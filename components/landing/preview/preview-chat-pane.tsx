import { PreviewChatHeader } from "@/components/landing/preview/preview-chat-header";
import { PreviewMessageList } from "@/components/landing/preview/preview-message-list";
import { PreviewComposer } from "@/components/landing/preview/preview-composer";

export function PreviewChatPane() {
  return (
    <div className="flex min-h-[460px] flex-col">
      <PreviewChatHeader />
      <PreviewMessageList />
      <PreviewComposer />
    </div>
  );
}
