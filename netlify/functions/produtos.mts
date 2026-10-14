import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { produtos } from "../../db/schema.js";

export default async (req: Request, context: Context) => {
  try {
    const id = context.params.id ? Number(context.params.id) : undefined;

    if (req.method === "GET" && id === undefined) {
      const resultados = await db.select().from(produtos).orderBy(produtos.id);
      return Response.json(resultados);
    }

    if (req.method === "POST" && id === undefined) {
      const { nome, preco } = await req.json();
      if (!nome || preco == null) {
        return Response.json({ erro: "Informe nome e preço" }, { status: 400 });
      }
      const [produto] = await db
        .insert(produtos)
        .values({ nome, preco: String(preco) })
        .returning();
      return Response.json({ mensagem: "Produto cadastrado!", id: produto.id }, { status: 201 });
    }

    if (req.method === "PUT" && id !== undefined) {
      const { nome, preco } = await req.json();
      if (!nome || preco == null) {
        return Response.json({ erro: "Informe nome e preço" }, { status: 400 });
      }
      const atualizados = await db
        .update(produtos)
        .set({ nome, preco: String(preco) })
        .where(eq(produtos.id, id))
        .returning();
      if (atualizados.length === 0) {
        return Response.json({ erro: "Produto não encontrado" }, { status: 404 });
      }
      return Response.json({ mensagem: "Produto atualizado!" });
    }

    if (req.method === "DELETE" && id !== undefined) {
      const apagados = await db.delete(produtos).where(eq(produtos.id, id)).returning();
      if (apagados.length === 0) {
        return Response.json({ erro: "Produto não encontrado" }, { status: 404 });
      }
      return Response.json({ mensagem: "Produto excluído!" });
    }

    return Response.json({ erro: "Método não permitido" }, { status: 405 });
  } catch (erro) {
    return Response.json({ erro: ((erro as Error).cause as Error)?.message ?? (erro as Error).message }, { status: 500 });
  }
};

export const config: Config = {
  path: ["/produtos", "/produtos/:id"],
};
