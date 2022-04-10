const { MessageEmbed } = require("discord.js");
let cases = require("../models/cases");

module.exports.run = async (client, interaction, options) => {
    let user = interaction.options.getUser("user");
    let reason = interaction?.options?.getString("reason") ?? "No reason specified"

    let warnCase = await new cases({
        userID: user.id,
        moderatorID: interaction.member.id,
        caseID: client.generateCase(),
        type: "WARN",
        reason,
    }).save();
    let embed = new MessageEmbed()
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`**${user} (\`${user.id}\`) has been warned.**`)
        .addField("CaseID", `**${warnCase.caseID}**`, true)
        .addField("Moderator", `${interaction.member}`, true)
        .addField("Reason", reason)
        .setFooter({ text: "Case ID has been recorded" })
        .setColor("GREEN")
        .setTimestamp();

    await user.send({ embeds: [embed] });
    await interaction.reply({ content: `**${user} has been warned check <#${client.config.logs}> for more details**`, ephemeral: true }).catch(() => { });
    client.channels.cache.get(client.config.logs).send({ embeds: [embed] });
}

module.exports.help = {
    name: "warn",
    description: "Command to warn users",
    options: [{
        name: "user",
        description: "User to warn",
        type: "USER",
        required: true
    },
    {
        name: "reason",
        description: "Reason for the warn",
        type: "STRING"
    }]
}

module.exports.requirements = {
    userPerms: ["BAN_MEMBERS"],
    clientPerms: []
}