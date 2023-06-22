import { ButtonInteraction, ChannelSelectMenuInteraction, ComponentType, Interaction, InteractionResponse, MentionableSelectMenuInteraction, Message, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
import { EventEmitter } from "../event_emitter";

type InteractionTypes = {
  [ComponentType.ActionRow]: ButtonInteraction | StringSelectMenuInteraction | UserSelectMenuInteraction | RoleSelectMenuInteraction | MentionableSelectMenuInteraction | ChannelSelectMenuInteraction,
  [ComponentType.Button]: ButtonInteraction,
  [ComponentType.ChannelSelect]: ChannelSelectMenuInteraction,
  [ComponentType.MentionableSelect]: MentionableSelectMenuInteraction,
  [ComponentType.RoleSelect]: RoleSelectMenuInteraction,
  [ComponentType.StringSelect]: StringSelectMenuInteraction,
  [ComponentType.TextInput]: ButtonInteraction | StringSelectMenuInteraction | UserSelectMenuInteraction | RoleSelectMenuInteraction | MentionableSelectMenuInteraction | ChannelSelectMenuInteraction,
  [ComponentType.UserSelect]: UserSelectMenuInteraction
}

type CollectorEventEmitter<Type extends ComponentType> = EventEmitter<{
  'collect': (interaction: InteractionTypes[Type]) => Promise<void>
}>

export class PermanentCollector {
  private static messageHandlers: {
    [messageId: string]: CollectorEventEmitter<any>
  } = {}

  static createMessageComponentCollector<Type extends ComponentType>(options: {
    message: Message | InteractionResponse,
    componentType: Type
  }): CollectorEventEmitter<Type> {
    const eventEmitter = new EventEmitter();
    PermanentCollector.messageHandlers[options.message.id] = eventEmitter;
    return eventEmitter;
  }

  static emitCollect(
    message: Message | InteractionResponse,
    interaction: Interaction
  ): void {
    const eventEmitter = PermanentCollector.messageHandlers[message.id];
    if (!eventEmitter) {
      return;
    }

    eventEmitter.emit('collect', interaction);
  }
}