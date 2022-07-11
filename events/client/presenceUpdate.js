//here the event starts
module.exports = (client, oldMember, newMember) => {
    //console.log(oldMember);
    //console.log(newMember);
    console.log(`Old Presence: ${oldMember.status} | New Presence: ${newMember.status}`);
}
