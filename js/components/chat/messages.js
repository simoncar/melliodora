module.exports = [
    {
      _id: Math.round(Math.random() * 1000000),
      text: 'Yes, and I use Gifted Chat!',
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
      text: 'Are you building a chat app?',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
      },
    },
    {
      _id: Math.round(Math.random() * 1000000),
      text: "Chatroom subject to PTA Chat Guidelines",
      createdAt: new Date(),
      system: true,
    },
  ];