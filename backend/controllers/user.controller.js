const prisma = require("../prismaClient");

exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ message: "Avatar is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar }
    });

    const { password, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};