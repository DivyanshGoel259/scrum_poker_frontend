import { useParams, useSearchParams } from "react-router-dom";
import { ModalForGuest } from "../../components/Modal";
import { useEffect, useState } from "react";
import { handleSocketMessages, handleSocketRequests } from "./api";
import { Player } from "../../types";
import { PlayerCard } from "./components/PlayerCard";
import { Button } from "../../components/ui/button";
import { globalState } from "./../../globalState";

const Cards = ["2", "4", "6", "1", "8"];

export const Game = () => {
  const [isDialogueOpen, setDialogueOpen] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [players, setPlayers] = useState<Array<Player> | undefined>();
  const [selected, setSelected] = useState(false);
  const [revealed, setrevealed] = useState(false);
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();
  const { name } = globalState();

  const handleSelect = async (card: string) => {
    try {
      if (!name) {
        return;
      }
      const data = {
        type: "selected",
        name: name,
        socket: socket,
        number: card,
        gameId: gameId,
      };
      await handleSocketRequests(data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleReveal = async ()=>{
    try{
        if(!name){return}
        const data = {
            type:"reveal",
            name:name,
            gameId:gameId,
            socket:socket
        }
        await handleSocketRequests(data)

    } catch (err:any){
        console.log(err.message)
    }
  }

  useEffect(() => {
    try {
      const isRedirect = searchParams.get("from") === "redirect";
      if (gameId && !isRedirect) {
        setDialogueOpen(true);
      }
      const userId = localStorage.getItem("userId");
      const socket = new WebSocket(`ws://localhost:8080?userId=${userId}`);
      socket.onopen = () => {
        console.log("connection Established");
        setSocket(socket);
      };
      socket.onerror = (err: any) => {
        throw err;
      };

      socket.onmessage = (message) => {
        handleSocketMessages(message, setPlayers, players, setSelected,setrevealed);
      };
    } catch (err: any) {
      console.log(err.message);
    }

    return () => {
      socket?.close();
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200">
      <div className="w-full max-w-4xl p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="font-semibold text-4xl">
              Planning Poker
            </div>
            <div className="mt-3 text-gray-600">
              Vote your estimates and reveal together
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 justify-center mb-8">
            {players?.map((player) => (
              <div key={player.name} className="col-span-1">
                <PlayerCard player={player} revealed={revealed} />
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-8">
            <Button onClick={handleReveal}>{revealed?"Revealed":"Reveal"}</Button>
          </div>

          <div className="flex justify-center gap-3">
            {Cards.map((card) => (
              <div
                key={card}
                onClick={() => handleSelect(card)}
                className={`
                  ${selected 
                    ? "bg-blue-500 text-white" 
                    : "hover:bg-blue-500 hover:text-white"}
                  cursor-pointer 
                  border 
                  border-gray-300 
                  font-bold 
                  py-7 
                  px-4 
                  rounded-[5px]
                  flex 
                  flex-col 
                  justify-center
                `}
              >
                {card}
              </div>
            ))}
          </div>

          {gameId && (
            <ModalForGuest
              gameId={gameId}
              socket={socket}
              isOpen={isDialogueOpen}
              onClose={() => setDialogueOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};