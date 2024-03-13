import express, { Request, Response } from 'express';
import User from '../schemas/user';
import Count from '../schemas/count';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    const count = await Count.findById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    } else if (!count) {
      res.status(404).json({ error: 'Count not found' });
      return;
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      count: count.count,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:id/count', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const user = await Count.findById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      count: user.count,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/new', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.query;

    const user = new User({ username, email, password });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { username, email, password } = req.query;

    const user = await User.findByIdAndUpdate(
      id,
      { username, email, password },
      { new: true }
    );
    await user?.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
