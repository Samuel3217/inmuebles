import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import {
  CircleMinus,
  CirclePlus,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import { deleteUser } from "./actions";
import { useUsersStore } from "./useUsers";

function RowActions({ user }: { user: User }) {
  const { openDialog, refetchUsers } = useUsersStore();


  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await deleteUser(userId);
    },
    onSuccess: () => {
      refetchUsers();
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              openDialog(user);
            }}
          >
            Edit
            <Edit />
          </DropdownMenuItem>
          <DropdownMenuItem
            variant={
              user.isActive === true || user.isActive === false
                ? "default"
                : "destructive"
            }
            className={cn("", {
              "text-green-500! *:[svg]:!text-green-500 hover:bg-green-500/10!":
                user.isActive === false,
            })}
            onClick={() => {
              deleteMutation.mutate(user.id);
            }}
          >
            {user.isActive === false ? (
              <>
                <CirclePlus /> Habilitar
              </>
            ) : (
              <>
                <CircleMinus /> Desactivar
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default RowActions;
