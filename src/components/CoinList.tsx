
interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  amount: string;
  value: string;
}

interface CoinListProps {
  coins?: Coin[];
}

const CoinList = ({ coins }: CoinListProps) => {
  const defaultCoins: Coin[] = [
    {
      id: "1",
      name: "XLM",
      symbol: "USDT",
      image: "https://i.ibb.co/B2q6bKh/512.png",
      amount: "0.000000",
      value: "0.000$"
    },
    {
      id: "2",
      name: "BTC",
      symbol: "USDT",
      image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      amount: "0.000000",
      value: "0.000$"
    },
    {
      id: "3",
      name: "ETH",
      symbol: "USDT",
      image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      amount: "0.000000",
      value: "0.000$"
    },
    {
      id: "4",
      name: "SOL",
      symbol: "USDT",
      image: "https://cryptologos.cc/logos/solana-sol-logo.png",
      amount: "0.000000",
      value: "0.000$"
    },
    {
      id: "5",
      name: "ICP",
      symbol: "USDT",
      image: "https://i.ibb.co/qDzm0xR/1711139481440-8916.png",
      amount: "0.000000",
      value: "0.000$"
    }
  ];

  const displayCoins = coins || defaultCoins;

  return (
    <div>
      <h1 className="text-sm font-bold text-white mb-2">Balances</h1>
      <div className="h-[calc(100vh-415px)] overflow-auto">
        {displayCoins.map((coin) => (
          <div key={coin.id} className="flex items-center gap-3 border-b border-gray-700/60 py-3">
            <img 
              className="w-[40px] h-[40px] rounded-full border-t-[2px] border-gray-200 bg-white shadow-sm shadow-lime-500" 
              src={coin.image} 
              alt={coin.name} 
            />
            <div className="flex-auto">
              <h1 className="text-[16px] font-bold text-white">
                {coin.name}<span className="text-gray-300 text-[14px] font-normal">/{coin.symbol}</span>
              </h1>
              <h1 className="text-[11px] text-gray-500">{coin.name} /{coin.symbol}</h1>
            </div>
            <div className="text-end">
              <h1 className="text-[16px] font-bold text-white">{coin.amount}</h1>
              <h1 className="text-[11px] text-end font-medium text-gray-500">≈ {coin.value}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoinList;
