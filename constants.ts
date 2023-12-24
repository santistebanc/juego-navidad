export const s3host = "https://navidad2023.s3.amazonaws.com/";

export const resouceURL = (id: string, postfix?: string) =>
  s3host + id + (postfix ?? "");

export const localQuestions = {
  // Bandera: { type: "flash", points: 10, question: "que es", answer: "no se" },
};
