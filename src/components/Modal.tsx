import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { handleSocketRequests } from "../pages/game/api";
import { globalState } from "../globalState";

interface props {
  isOpen: boolean;
  onClose: () => void;
  socket: WebSocket | null;
  gameId: string;
}
export const ModalForGuest = ({ isOpen, onClose, socket, gameId }: props) => {
  const {set,name} = globalState()
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    onClose();
  };

  const handleJoinGame = async () => {
    setLoading(true);
    try {
      if(!name){return }

      await handleSocketRequests({
        socket: socket,
        name: name,
        type: "join",
        gameId: gameId,
      });
    } catch (err: any) {
      console.log(err.message);
    }
    setLoading(false);
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              Choose your display name
            </DialogTitle>
            <DialogDescription className="p-2 mt-4">
              <Label className="text-black" htmlFor="display">
                Display name
              </Label>
              <Input
                onChange={(e) => {
                  set({name:e.target.value})
                }}
                className="mt-2"
                id="display"
                type="text"
                placeholder="Enter name"
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleJoinGame}>Continue to Vote</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
