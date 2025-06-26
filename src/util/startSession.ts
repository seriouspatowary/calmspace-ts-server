import ChatSessionModel from "../models/ChatSession";

export const startChatSession = async (
  userId: string,
  counselorId: string,
  amount: number
) => {
  const duration = 20; // minutes
  const now = new Date();
  const expires = new Date(now.getTime() + duration * 60 * 1000); 

  // Find the latest session
  let session = await ChatSessionModel.findOne({
    userId,
    counselorId
  }).sort({ expiredAt: -1 });

  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000); // last 24 hrs

  const recentSessions = await ChatSessionModel.find({
    userId,
    counselorId,
    startedAt: { $gte: since }
  });

  const totalDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0);

  if (totalDuration >= 60) {
    const lastExpiredAt = session?.expiredAt?.getTime() ?? now.getTime();
    const nextAvailable = new Date(lastExpiredAt + 24 * 60 * 60 * 1000);
    const waitMs = nextAvailable.getTime() - now.getTime();
    const waitHours = (waitMs / (1000 * 60 * 60)).toFixed(1);
    throw new Error(`You've reached the 1-hour limit with this counselor. Try again in ${waitHours} hour(s).`);
  }

  if (session) {
    // Update existing session
    session.amount = amount;
    session.duration = duration;
    session.startedAt = now;
    session.expiredAt = expires;
    await session.save();
  } else {
    // Create new session
    session = new ChatSessionModel({
      userId,
      counselorId,
      amount,
      duration,
      startedAt: now,
      expiredAt: expires
    });
    await session.save();
  }

  return session;
};
