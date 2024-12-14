import { useParams, useSearchParams } from "react-router-dom";
import { ModalForGuest } from "../../components/Modal";
import { useEffect, useState } from "react";
import { handleSocketRequests } from "./api";
import { Message } from "../../types";
import { PlayerCard } from "./components/PlayerCard";
import { Button } from "../../components/ui/button";
import { globalState } from "./../../globalState";

const Cards = ["2", "4", "6", "1", "8"];

interface Selected {
  card: string;
  selected: boolean;
}

export const Game = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [selected, setSelected] = useState<Selected>({
    card: "0",
    selected: false,
  });
  const [revealed, setrevealed] = useState(false);
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();
  const { organizerId, organizerName } = globalState();
  const [message, setMessage] = useState<Partial<Message>>({
    gameId: gameId,
    name: localStorage.getItem("userName")!,
  });

  const handleSelect = async (card: string) => {
    try {
      const data = {
        type: "voted",
        message: {
          number: card,
          gameId: gameId,
          userId: message.userId,
        },
      };
      await handleSocketRequests(socket!, data);
      setSelected((prevCard) => ({ ...prevCard, card: card, selected: true }));
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleReveal = async () => {
    try {
      if (!organizerId) {
        return;
      }
      const data = {
        type: "reveal",
        message: {
          userId: message.userId,
          gameId: gameId,
        },
      };
      await handleSocketRequests(socket!, data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleJoinGame = async (socket: WebSocket | null) => {
    try {
      await handleSocketRequests(socket!, {
        type: "join",
        message: {
          userId: message.userId,
          gameId: message.gameId,
          name: message.name,
        },
      });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    try {
      if (organizerId) {
        setMessage((prevMessage) => ({
          ...prevMessage,
          userId: organizerId,
          name: organizerName!,
        }));
      }
    } catch (err: any) {
      console.log(err.message);
    }
    return () => {
      socket?.close();
    };
  }, []);

  useEffect(() => {
    try {
      if (!socket) {
        const webSocket = new WebSocket(
          `ws://localhost:8080?userId=${message.userId}`
        );
        webSocket.onopen = () => {
          console.log("connection Established");
          setSocket(webSocket);
        };

        webSocket.onerror = (err: any) => {
          throw err;
        };

        webSocket.onmessage = (data: any) => {
          data = JSON.parse(data);
          if (data.type === "game") {
            setMessage(data.message);
          }
          if (data.type === "new_user" && !organizerId) {
            setMessage((prevMessage) => ({
              ...prevMessage,
              userId: data.assignedId,
            }));
          }
        };
        if (!organizerId) {
          handleJoinGame(socket);
        }
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }, [message.userId, socket]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200">
      <div className="w-full max-w-4xl p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="font-semibold text-4xl">Planning Poker</div>
            <div className="mt-3 text-gray-600">
              Vote your estimates and reveal together
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 justify-center mb-8">
            {message.players?.map((player) => (
              <div key={player.name} className="col-span-1">
                <PlayerCard player={player} revealed={revealed} />
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-8">
            <Button onClick={handleReveal}>
              {revealed ? "Revealed" : "Reveal"}
            </Button>
          </div>

          <div className="flex justify-center gap-3">
            {Cards.map((card) => (
              <div
                key={card}
                onClick={() => handleSelect(card)}
                className={`
                  ${
                    selected && selected.card === card
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-500 hover:text-white"
                  }
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
        </div>
      </div>
    </div>
  );
};

export const GamePage = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isDialogueOpen, setDialogueOpen] = useState(false);
  const { gameId } = useParams();
  const { organizerId } = globalState();

  useEffect(() => {
    if (gameId && !organizerId) {
      setDialogueOpen(true);
    }
  }, []);
  return (
    <div>
      {userName || organizerId && <Game />}
      <ModalForGuest
        isOpen={isDialogueOpen}
        onClose={() => {
          const uName = localStorage.getItem("userName");
          if (uName) {
            setUserName(uName);
            setDialogueOpen(false);
          }
        }}
      />
    </div>
  );
};
