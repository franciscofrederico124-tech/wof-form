export default async function ping(req, res) {
  return res.status(200).json({
    success: true,
    status: "ok",
    content: {
      message: "pong",
    },
  });
}
