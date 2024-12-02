import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "List of animals","date": "September 2024"}, animals : [] }
const db = await JSONFilePreset('db.json', defaultData)
const animals = db.data.animals

export async function responseExample(req, res) {
  res.status(200).send(animals);
}

export async function updateExample(req, res) {
  // fixme check if id exists
  let id = req.query.id;
  let name = req.query.name;
  let type = req.query.type;
  let time = new Date().toLocaleString();
  let animal = {id: id, name: name, type: type, time: time};  
  // todo remove log
  console.log(animal);
  animals.push(animal);
  await db.write();

  res.status(201).send(`I added this client: ${JSON.stringify(animal)}?`);
}

export async function responseByIdExample(req, res) {
  let id = req.params.id;
  let animal = animals.find(animal => animal.id === id);
  if (animal) {
    res.status(200).send(animal);
  } else {
    res.status(404).send('Animal not found');
  }
}
