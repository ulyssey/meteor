if (Meteor.isClient){
  Template.privateTag.events({
    "click .toggle-private": function () {
      Meteor.call("setPrivate", Template.instance().data._id, ! this.private);
    }
  });
}

Meteor.methods({
  setPrivate: function (taskId, setToPrivate) {
  var task = Tasks.findOne(taskId);
    console.log(task);

  // Make sure only the task owner can make a task private
  if (task.owner !== Meteor.userId()) {
    throw new Meteor.Error("not-authorized");
  }

  Tasks.update(taskId, { $set: { private: setToPrivate } });
}
});