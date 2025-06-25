"use server";
import prisma from "@/db";

export async function getUsers() {

      const res = await prisma.user.findMany({orderBy: {id:"asc"}})
      return res;
}

export async function deleteUser(userid: number) {

    const user = await prisma.user.findUnique({
        where: {id:userid}
    })

    if(!user){
        throw new Error("No se encontro usuario");

    }

    await prisma.user.update({
where: {id: userid}, data: {isActive: !user?.isActive}
    })

}

export async function updateUser(editid: number, formData:FormData) {
    const name = formData.get("name") as string
    await prisma.user.update({
        where: {id:editid}, data: {name}
    })
}

export async function getUserById(userid: number) {
    const get = await prisma.user.findUnique({
        where: {id: userid}
    })
    return get
}
