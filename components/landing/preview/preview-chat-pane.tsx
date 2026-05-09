import { PreviewChatHeader } from "@/components/landing/preview/preview-chat-header";
import { PreviewMessageList } from "@/components/landing/preview/preview-message-list";
import { PreviewComposer } from "@/components/landing/preview/preview-composer";
import type { PreviewMessage, SessionItem } from "@/components/landing/preview/preview-data";

type PreviewChatPaneProps = {
  session: SessionItem;
  messages: PreviewMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onOpenSidebar: () => void;
};

export function PreviewChatPane({
  session,
  messages,
  inputValue,
  onInputChange,
  onSend,
  onOpenSidebar,
}: PreviewChatPaneProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PreviewChatHeader session={session} onOpenSidebar={onOpenSidebar} />
      <PreviewMessageList messages={messages} session={session} />
      <PreviewComposer value={inputValue} onChange={onInputChange} onSend={onSend} />
    </div>
  );
}
