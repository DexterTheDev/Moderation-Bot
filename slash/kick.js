const { MessageEmbed } = require("discord.js");
let cases = require("../models/cases");

module.exports.run = async (client, interaction, options) => {
    let user = interaction.options.getUser("user");
    let reason = interaction?.options?.getString("reason") ?? "No reason specified"

    interaction.guild.members.cache.get(user.id).kick({ reason }).then(async () => {
        let kickCase = await new cases({
            userID: user.id,
            moderatorID: interaction.member.id,
            caseID: client.generateCase(),
            type: "KICK",
            reason,
        }).save();
        let embed = new MessageEmbed()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**${user} (\`${user.id}\`) has been kicked.**`)
            .addField("CaseID", `**${kickCase.caseID}**`, true)
            .addField("Moderator", `${interaction.member}`, true)
            .addField("Reason", reason, true)
            .setFooter({ text: "Case ID has been recorded" })
            .setColor("GREEN")
            .setTimestamp();

        await interaction.reply({ content: `**${user} has been kicked check <#${client.config.logs}> for more details**`, ephemeral: true }).catch(() => { });
        client.channels.cache.get(client.config.logs).send({ embeds: [embed] });
    }).catch(async () => {
        await interaction.reply({ content: `**:x: Error Occured, I am not able to kick ${user}**`, ephemeral: true })
    })

}

module.exports.help = {
    name: "kick",
    description: "Command to kick users",
    options: [{
        name: "user",
        description: "User to kick",
        type: "USER",
        required: true
    },
    {
        name: "reason",
        description: "Reason for the kick",
        type: "STRING"
    }]
}

module.exports.requirements = {
    userPerms: ["KICK_MEMBERS"],
    clientPerms: []
}