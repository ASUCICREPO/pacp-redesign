import { MessageSquare } from 'lucide-react';
import { useAssistant } from '../context/AssistantContext.jsx';
import { AssistantPanel } from './AssistantPanel.jsx';

export function AssistantDock() {
  const {
    open: i,
    setOpen: n
  } = useAssistant();
  return <>{!i && <button onClick={() => n(!0)} className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 px-4 py-3 bg-[#B5563B] text-white rounded-full shadow-lg hover:bg-[#9E4A32] hover:shadow-xl transition-all"><MessageSquare className="w-4 h-4" /><span className="text-[13px] font-medium">PACP Assistant</span></button>}{i && <AssistantPanel />}</>;
}

export default AssistantDock;
