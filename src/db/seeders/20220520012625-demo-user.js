'use strict';

const { randWord,randFirstName, randLastName, randEmail } = require('@ngneat/falso')

module.exports = {
    async up(queryInterface, Sequelize) {


        for(let i =1; i<=30; i++){
            await queryInterface.bulkInsert('Users', [
                {
                    firstName: randFirstName(),
                    lastName: randLastName(),
                    email: randEmail(),
                    password: '1234',
                    createdAt: new Date,
                    updatedAt: new Date
                }
            ], );

        }

    },

    async down(queryInterface, Sequelize) {
        
         await queryInterface.bulkDelete('Users', null, {});
        
    }
};