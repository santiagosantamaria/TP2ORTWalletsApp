'use strict';

const { randWord } = require('@ngneat/falso')

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.bulkInsert('Users', [{
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@doe.com',
                password: '123454',
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                firstName: 'Pedro',
                lastName: 'Perez',
                email: 'pedroperez@gmail.com',
                password: '123454',
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                firstName: 'Juan',
                lastName: 'Dominguez',
                email: 'juandgz@gmail.com',
                password: '123454',
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                firstName: 'Analia',
                lastName: 'Beltrandi',
                email: 'anabel1987@gmail.com',
                password: '123454',
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                firstName: 'Joshua',
                lastName: 'Blake',
                email: 'jbwalker@gmail.com',
                password: '123454',
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                firstName: 'Aron',
                lastName: 'Mcnamara',
                email: 'aronmc1992@gmail.com',
                password: '123454',
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                firstName: 'Karen',
                lastName: 'Silva',
                email: 'karensilva98@gmail.com',
                password: '123454',
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                firstName: 'Silvia',
                lastName: 'Correa',
                email: 'scorrea_21@gmail.com',
                password: '123454',
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                firstName: 'Sebastian',
                lastName: 'Muller',
                email: 'smuller@gmail.com',
                password: '123454',
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                firstName: 'Alex',
                lastName: 'Curello',
                email: 'alecurr1@gmail.com',
                password: '123454',
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                firstName: 'Solimano',
                lastName: 'Shakur',
                email: 'solinmahrshakur@gmail.com',
                password: '123454',
                createdAt: new Date,
                updatedAt: new Date
            },
            {
                firstName: 'Federico',
                lastName: 'Prince',
                email: 'fedeprinceitaly@gmail.com',
                password: '123454',
                createdAt: new Date,
                updatedAt: new Date
            },
        ], {});

    },

    async down(queryInterface, Sequelize) {
        
         await queryInterface.bulkDelete('Users', null, {});
        
    }
};