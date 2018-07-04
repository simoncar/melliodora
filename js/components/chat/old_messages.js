module.exports = [
    {
      _id: Math.round(Math.random() * 1000000),
      text:
        "Here is the link to more info about lost and found if you missed it http://",
      createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
      user: {
        _id: 1,
        name: "Developer"
      }
    },
    {
      _id: Math.round(Math.random() * 1000000),
      text: "Some old Message",
      createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
      user: {
        _id: 1,
        name: "Developer"
      }
    },
    {
      _id: Math.round(Math.random() * 1000000),
      text: "This is a system message.",
      createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
      system: true
    }
  ];