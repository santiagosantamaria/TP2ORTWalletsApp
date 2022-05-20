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
        ], {});

    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};