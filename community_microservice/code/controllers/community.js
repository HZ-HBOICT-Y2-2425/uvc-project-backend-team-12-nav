import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export async function community(req, res) {
  try {
    const adapter = new JSONFile('db.json');
    const db = new Low(adapter, { members: [] });

    await db.read();

    if (!db.data || !db.data.members) {
      db.data = { members: [] };
    }

    res.json(db.data.members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).send("Internal server error.");
  }
}

export async function addMember(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send("Name is required.");
  }

  try {
    const adapter = new JSONFile('db.json');
    const db = new Low(adapter, { members: [] });

    await db.read();

    if (!db.data || !db.data.members) {
      db.data = { members: [] };
    }

    const maxId = db.data.members.reduce((max, member) => Math.max(max, member.id), 0);
    const newId = maxId + 1;

    const newMember = {
      id: newId,
      name
    };

    db.data.members.push(newMember);
    await db.write();

    res.status(201).json({
      message: "Member added successfully",
      member: newMember
    });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).send("Internal server error.");
  }
}

export async function deleteMember(req, res) {
  const { id } = req.params;

  try {
    const adapter = new JSONFile('db.json');
    const db = new Low(adapter, { members: [] });

    await db.read();

    if (!db.data || !db.data.members) {
      db.data = { members: [] };
    }

    const memberId = parseInt(id, 10);
    const index = db.data.members.findIndex((member) => member.id === memberId);

    if (index === -1) {
      return res.status(404).send("Member not found.");
    }

    const removedMember = db.data.members.splice(index, 1);
    await db.write();

    res.json({
      message: "Member deleted successfully",
      member: removedMember[0]
    });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).send("Internal server error.");
  }
}

export async function updateMember(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).send("Name is required.");
  }

  try {
    const adapter = new JSONFile('db.json');
    const db = new Low(adapter, { members: [] });

    await db.read();

    if (!db.data || !db.data.members) {
      db.data = { members: [] };
    }

    const memberId = parseInt(id, 10);
    const member = db.data.members.find((member) => member.id === memberId);

    if (!member) {
      return res.status(404).send("Member not found.");
    }

    member.name = name;
    await db.write();

    res.json({
      message: "Member updated successfully",
      member
    });
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).send("Internal server error.");
  }
}
