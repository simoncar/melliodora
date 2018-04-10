module.exports = [
    {
      _id: Math.round(Math.random() * 1000000),
      text: 'Yes, we are here to Chat!',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Developer',
      },
      sent: true,
      received: true,
      // location: {
      //   latitude: 48.864601,
      //   longitude: 2.398704
      // },
    },
    {
      _id: Math.round(Math.random() * 1000000),
      text: 'How can the PTA help you?',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Simon',
      },
    },
    {
      _id: Math.round(Math.random() * 1000000),
      text: "Chatroom subject to PTA Chat Guidelines",
      createdAt: new Date(),
      system: true,
    },
  ];