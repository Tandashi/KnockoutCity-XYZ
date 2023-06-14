import {
  SlashCommandBuilder
} from 'discord.js';
import { BasicDiscordCommand } from '../../command';
import { findTeamByUser, leaveTeam } from '../../../services/team';
import { findOrCreateBrawler } from '../../../services/brawler';
import { findTournamentsUserIsSignedUpFor } from '../../../services/tournament';

export const LeaveTeamBasicCommand = {
  type: 'basic',

  data: new SlashCommandBuilder()
    .setName('leave-team')
    .setDescription('Leave your current Team'),

  execute: async (interaction) => {
    const team = await findTeamByUser(interaction.user);
    // If the user is currently not in a team
    if (!team) {
      await interaction.reply({
        content: 'You are not in a team!',
        ephemeral: true
      })
      return;
    }

    const brawler = await findOrCreateBrawler(interaction.user);
    if (team.ownerId === brawler.id) {
      await interaction.reply({
        content: 'You are the owner and can not leave the Team. Use the disband command instead.',
        ephemeral: true
      })
      return;
    }

    const signupTournaments = await findTournamentsUserIsSignedUpFor(
      interaction.user
    )

    if (signupTournaments.length > 0) {
      await interaction.reply({
        content: 'You are currently still signed up for active Tournaments.',
        ephemeral: true
      })
      return;
    }

    const leftTeam = await leaveTeam(team.id, interaction.user)
    if (!leftTeam) {
      await interaction.reply({
        content: `An Error occured leaving Team: ${team.name}`,
        ephemeral: true
      })
      return;
    }

    await interaction.reply({
      content: `Successfully left Team: ${leftTeam.name}`,
      ephemeral: true
    })

  }
} satisfies BasicDiscordCommand


