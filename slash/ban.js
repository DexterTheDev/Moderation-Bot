const { MessageEmbed } = require("discord.js");
let cases = require("../models/cases");

module.exports.run = async (client, interaction, options) => {
    let user = interaction.options.getUser("user");
    let reason = interaction?.options?.getString("reason") ?? "No reason specified"
    if (await interaction.guild.fetchBans().has(user.id)) interaction.reply({ content: `**❌ ${user} is already banned.**`, ephemeral: true })
    else {
        interaction.guild.members.cache.get(user.id).ban({ reason }).then(async () => {
            let banCase = await new cases({
                userID: user.id,
                moderatorID: interaction.member.id,
                caseID: client.generateCase(),
                type: "BAN",
                reason,
            }).save();
            let embed = new MessageEmbed()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`**${user} (\`${user.id}\`) has been banned.**`)
                .addField("CaseID", `**${banCase.caseID}**`, true)
                .addField("Moderator", `${interaction.member}`, true)
                .addField("Reason", reason, true)
                .setFooter({ text: "Case ID has been recorded" })
                .setColor("GREEN")
                .setTimestamp();

                await interaction.reply({ content: `**${user} has been banned check <#${client.config.logs}> for more details**`, ephemeral: true }).catch(() => { });
            client.channels.cache.get(client.config.logs).send({ embeds: [embed] });
        }).catch(async () => {
            await interaction.reply({ content: `**:x: Error Occured, I am not able to ban ${user}**`, ephemeral: true })
        })
    }
}

module.exports.help = {
    name: "ban",
    description: "Command to ban users",
    options: [{
        name: "user",
        description: "User to ban",
        type: "USER",
        required: true
    },
    {
        name: "reason",
        description: "Reason for the ban",
        type: "STRING"
    }]
}

module.exports.requirements = {
    userPerms: ["BAN_MEMBERS"],
    clientPerms: []
}