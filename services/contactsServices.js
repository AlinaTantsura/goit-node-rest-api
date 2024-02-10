import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const contactsPath = join(process.cwd(),"db", 'contacts.json')

async function listContacts() {
  // ...твій код. Повертає масив контактів.
  // return await readFile(contactsPath).then(data => JSON.parse(data)).catch(err => err);
  const list = await readFile(contactsPath);
  return JSON.parse(list);

}

async function getContactById(contactId) {
  // ...твій код. Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
  const list = await listContacts();
  const index = list.findIndex(item => item.id === contactId);
  if (index === -1) return null
  else return list[index];
}

async function removeContact(contactId) {
  // ...твій код. Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
  const list = await listContacts();
  const index = list.findIndex(item => item.id === contactId);
  if (index === -1) return null
  else{
    const filterList = list.filter(item => item.id !== contactId);
    const listJSON = JSON.stringify(filterList, null, 2);
    return await writeFile(contactsPath, listJSON).then(() => list[index]).catch(err => err);}
}

async function addContact(name, email, phone) {
  // ...твій код. Повертає об'єкт доданого контакту (з id).
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
  const contactUpdated = { id, name, email, phone};
  const newList = [...list.splice(0, index), contactUpdated, ...list.splice(index + 1,)];
  await writeFile(contactsPath, JSON.stringify(newList, null, 2));
 
  return contactUpdated;

};

export default { listContacts, getContactById, removeContact, addContact, updateContact};