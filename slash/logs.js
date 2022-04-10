const { MessageEmbed } = require("discord.js");
let cases = require("../models/cases");

module.exports.run = async (client, interaction, options) => {
    let user = interaction.options.getUser("user");
    let caseID = interaction.options.getString("caseid");

    if (!caseID) {
        let userCases = await cases.find({ userID: user.id });
        if (userCases.length <= 0) interaction.reply({ content: `**There are no any infractions for ${user}**`, ephemeral: true })
        else {
            let allCases = "";
            userCases.map(i => {
                allCases += `**CaseID: \`${i.caseID}\` (${i.type})**\n`
            });
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setAuthor({ name: `${user.tag} | Infractions`, iconURL: user.displayAvatarURL({ dynamic: true }) })
                        .setDescription(allCases)
                        .setColor("AQUA")
                        .setFooter({ text: "Copy the caseid and re run the command to get details about the case" })
                ], ephemeral: true
            })
        }
    } else {
        let aloneCase = await cases.findOne({ userID: user.id, caseID });
        if (!aloneCase) interaction.reply({ content: `**Couldn't find this infraction**`, ephemeral: true })
        else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setAuthor({ name: `${user.tag} | ${aloneCase.type}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
                        .addField("CaseID", `**${aloneCase.caseID}**`, true)
                        .addField("Moderator", `<@${aloneCase.moderatorID}>`, true)
                        .addField("Time", `${require("ms")((Date.now() - aloneCase.time), { long: true })} ago`, true)
                        .addField("Reason", aloneCase.reason, true)
                        .setColor("GREEN")
                ], ephemeral: true
            })
        }
    }
}

module.exports.help = {
    name: "logs",
    description: "Command to get user infractions",
    options: [{
        name: "user",
        description: "User to get user infractions",
        type: "USER",
        required: true
    },
    {
        name: "caseid",
        description: "CaseID to get specific case",
        type: "STRING"
    }]
}

module.exports.requirements = {
    userPerms: ["BAN_MEMBERS"],
    clientPerms: []
}