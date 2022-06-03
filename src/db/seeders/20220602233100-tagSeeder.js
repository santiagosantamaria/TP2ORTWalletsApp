'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('tags', [{


      name: "Mineable",
      createdAt: new Date,
      updatedAt: new Date
  },
  {

    name: "DPoS",
    createdAt: new Date,
    updatedAt: new Date
  },
  {

    name: "PoS",
    createdAt: new Date,
    updatedAt: new Date
  },
  {

    name: "Smart contract",
    createdAt: new Date,
    updatedAt: new Date
  },
  {

    name: "Staking",
    createdAt: new Date,
    updatedAt: new Date
  }

], {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
