/** 
1. відповідь повина мати статус-код 200 
2. у відповіді повинен повертатися токен 
3. у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String
 */
import supertest from "supertest";
import { app } from "../app";
import mongoose from 'mongoose'

const { DB_HOST } = process.env;

describe("Login test", () => {
    let response;
    beforeAll(async () => {
        await mongoose.connect(DB_HOST);
        console.log("Server is connected")
        response = await supertest(app).post('/api/users/login').send({
            "email": "catqwwe@gmail.com",
            "password": "qwerty123"
        });
    });
    afterAll(async () => {
        await mongoose.disconnect();
        console.log("Server is disconnected")
    });

    test("Test 200 status", async () => {
        expect(response.status).toBe(200);
    });

    test("Test token is exist", async () => {
        const respObj = JSON.parse(response.text);
        expect(respObj.token).toBeTruthy();
    });

    test("Test user object response", async() => {
        const respObj = JSON.parse(response.text);
             expect(respObj.user).toBeTruthy();
             expect(typeof (respObj.user.email)).toBe("string");
             expect(typeof (respObj.user.subscription)).toBe("string");

    })
})