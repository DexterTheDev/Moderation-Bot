const { MessageEmbed } = require("discord.js");
let cases = require("../models/cases");

module.exports.run = async (client, interaction, options) => {
    let user = interaction.options.getUser("user");
    let reason = interaction?.options?.getString("reason") ?? "No reason specified"
    let time = require("ms")(interaction?.options?.getString("time"));

    if (isNaN(time)) await interaction.reply({ content: "**:x: Unknown time format, use (1h, 1d, 30mins)**", ephemeral: true })
    else {
        interaction.guild.members.cache.get(user.id).timeout(time, { reason }).then(async () => {
            let muteCase = await new cases({
                userID: user.id,
                moderatorID: interaction.member.id,
                caseID: client.generateCase(),
                type: "TIMEOUT",
                reason,
            }).save();
            let embed = new MessageEmbed()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`**${user} (\`${user.id}\`) has been timeout.**`)
                .addField("CaseID", `**${muteCase.caseID}**`, true)
                .addField("Moderator", `${interaction.member}`, true)
                .addField("Duration", `\`${require("ms")(time, { long: true })}\``, true)
                .addField("Reason", reason, true)
                .setFooter({ text: "Case ID has been recorded" })
                .setColor("GREEN")
                .setTimestamp();

            await interaction.reply({ content: `**${user} has been timeouted check <#${client.config.logs}> for more details**`, ephemeral: true }).catch(() => { });
            client.channels.cache.get(client.config.logs).send({ embeds: [embed] });
        }).catch(async () => {
            await interaction.reply({ content: `**:x: Error Occured, I am not able to kick ${user}**`, ephemeral: true })
        })
    }
}

module.exports.help = {
    name: "mute",
    description: "Command to mute users",
    options: [{
        name: "user",
        description: "User to timeout",
        type: "USER",
        required: true
    },
    {
        name: "time",
        description: "Time for the mute",
        type: "STRING",
        required: true
    },
    {
        name: "reason",
        description: "Reason for the mute",
        type: "STRING"
    }]
}

module.exports.requirements = {
    userPerms: ["BAN_MEMBERS"],
    clientPerms: []
}