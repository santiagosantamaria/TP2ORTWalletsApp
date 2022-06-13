'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('tags', [{


      name: "Mineable",
      coinId: 1,
      createdAt: new Date,
      updatedAt: new Date
  },
  {

    name: "DPoS",
    coinId: 1,
    createdAt: new Date,
    updatedAt: new Date
  },
  {

    name: "PoS",
    coinId: 2,
    createdAt: new Date,
    updatedAt: new Date
  },
  {

    name: "Smart contract",
    coinId: 1,
    createdAt: new Date,
    updatedAt: new Date
  },
  {

    name: "Staking",
    coinId: 3,
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
