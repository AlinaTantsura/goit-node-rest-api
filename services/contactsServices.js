import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const contactsPath = join(process.cwd(),"db", 'contacts.json')

async function listContacts() {
  const list = await readFile(contactsPath);
  return JSON.parse(list);
}

async function getContactById(contactId) {
  const list = await listContacts();
  const index = list.findIndex(item => item.id === contactId);
  if (index === -1) return null
  else return list[index];
}

async function removeContact(contactId) {
  const list = await listContacts();
  const index = list.findIndex(item => item.id === contactId);
  if (index === -1) return null
  else {
    const removedContact = list[index];
    const filterList = list.filter(item => item.id !== contactId);
    const listJSON = JSON.stringify(filterList, null, 2);
    await writeFile(contactsPath, listJSON).then(() => list[index]).catch(err => err);
    return removedContact;
  }
  
}

async function addContact(name, email, phone) {
  const id = randomUUID();
  const newContact = { id, name, email, phone };
  const list = await listContacts();
  list.push(newContact)
  const listJSON = JSON.stringify(list, null, 2);
  await writeFile(contactsPath, listJSON).then(() => newContact).catch(err => err);
  return newContact;
};

async function updateContact(id, {name, email, phone}) {
  const list = await listContacts();
  const index = list.findIndex(contact => contact.id === id);
  const contact = list[index];
  const contactUpdated = { id, name: name || contact.name, email: email || contact.email, phone: phone || contact.phone};
  const newList = [...list.splice(0, index), contactUpdated, ...list.splice(index + 1,)];
  await writeFile(contactsPath, JSON.stringify(newList, null, 2));
 
  return contactUpdated;

};

export default { listContacts, getContactById, removeContact, addContact, updateContact};