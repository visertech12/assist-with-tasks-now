
import { Link } from "react-router-dom";
import { Wallet, ArrowDownToLine, ArrowUpToLine, Send, Award } from "lucide-react";

interface BalanceCardProps {
  balance?: string;
  payId?: string;
}

const BalanceCard = ({ 
  balance = "$0.50 USD", 
  payId = "PTCLab7890" 
}: BalanceCardProps) => {
  return (
    <div className="bg-lime-400 rounded-[20px] p-5 mt-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[16px] text-lime-900/70">Total Balance</h1>
          <h1 className="text-[36px] font-bold text-black">{balance}</h1>
        </div>
        <div>
          <h1 className="text-[10px] text-end text-lime-900/70">Pay Id</h1>
          <h1 className="text-[14px] text-end font-bold text-lime-700">{payId}</h1>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 mt-3">
        <QuickActionButton 
          icon={<ArrowDownToLine size={22} />} 
          label="Deposit" 
          path="/payment-details" 
        />
        <QuickActionButton 
          icon={<ArrowUpToLine size={22} />} 
          label="Withdraw" 
          path="/payment-details" 
        />
        <QuickActionButton 
          icon={<Send size={22} />} 
          label="Transfer" 
          path="/p2p-trade" 
        />
        <QuickActionButton 
          icon={<Award size={22} />} 
          label="Rewards" 
          path="/rewards" 
        />
      </div>
    </div>
  );
};

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const QuickActionButton = ({ icon, label, path }: QuickActionButtonProps) => {
  return (
    <Link className="grid justify-items-center" to={path}>
      <div className="w-[62px] h-[62px] aspect-square bg-black rounded-full p-[20px] flex items-center justify-center">
        <div className="text-white">{icon}</div>
      </div>
      <h1 className="text-black text-[14px] mt-2">{label}</h1>
    </Link>
  );
};

export default BalanceCard;
