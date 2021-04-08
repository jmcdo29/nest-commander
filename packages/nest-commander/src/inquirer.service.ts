import { DiscoveredMethodWithMeta, DiscoveryService } from '@golevelup/nestjs-discovery';
import { Inject, Injectable } from '@nestjs/common';
import type { DistinctQuestion, Inquirer as InquirerType } from 'inquirer';
import {
  InquirerKeysWithPossibleFunctionTypes,
  QuestionMetadata,
  QuestionNameMetadata,
} from './command-runner.interface';
import {
  ChoicesMeta,
  DefaultMeta,
  Inquirer,
  MessageMeta,
  QuestionMeta,
  QuestionSetMeta,
  TransformMeta,
  ValidateMeta,
  WhenMeta,
} from './constants';

@Injectable()
export class InquirerService {
  constructor(
    @Inject(Inquirer) private readonly inquirer: InquirerType,
    private readonly discoveryService: DiscoveryService,
  ) {}

  private readonly inquirerKeyToMetadataKeyMap: Record<
    InquirerKeysWithPossibleFunctionTypes,
    string
  > = {
    transformer: TransformMeta,
    when: WhenMeta,
    validate: ValidateMeta,
    message: MessageMeta,
    default: DefaultMeta,
    choices: ChoicesMeta,
  };

  async ask<T>(questionSetName: string, options: Partial<T> | undefined): Promise<T> {
    const rawQuestions = await this.findQuestionSet(questionSetName);
    const questions = await this.mapMetaQuestionToQuestion(rawQuestions);
    const answers = await this.inquirer.prompt<T>(questions, options);
    return answers;
  }

  private async findQuestionSet(
    questionSetName: string,
  ): Promise<DiscoveredMethodWithMeta<QuestionMetadata>[]> {
    const classes = await this.discoveryService.providersWithMetaAtKey<QuestionNameMetadata>(
      QuestionSetMeta,
    );
    const cls = classes.filter((c) => c.meta.name === questionSetName)[0];
    const questions = await this.discoveryService.providerMethodsWithMetaAtKey<QuestionMetadata>(
      QuestionMeta,
      (found) => found.name === cls.discoveredClass.name,
    );
    return questions;
  }

  private async mapMetaQuestionToQuestion(
    rawQuestions: DiscoveredMethodWithMeta<QuestionMetadata>[],
  ): Promise<ReadonlyArray<DistinctQuestion>> {
    const extraMetas: Record<string, DiscoveredMethodWithMeta<QuestionNameMetadata>[]> = {};
    for (const iKey of Object.keys(
      this.inquirerKeyToMetadataKeyMap,
    ) as Array<InquirerKeysWithPossibleFunctionTypes>) {
      const metaKey = this.inquirerKeyToMetadataKeyMap[iKey];
      const foundMeta = await this.discoveryService.providerMethodsWithMetaAtKey<QuestionNameMetadata>(
        metaKey,
        (found) => found.name === rawQuestions[0].discoveredMethod.parentClass.name,
      );
      extraMetas[iKey] = foundMeta ?? [];
    }

    const questions: Array<
      DistinctQuestion & { index?: number }
    > = await this.parseRawQuestionMetadata(rawQuestions, extraMetas);
    return questions.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  }

  private async parseRawQuestionMetadata(
    rawQuestions: DiscoveredMethodWithMeta<QuestionMetadata>[],
    extraMetas: Record<string, DiscoveredMethodWithMeta<QuestionNameMetadata>[]>,
  ): Promise<Array<DistinctQuestion & { index?: number; [key: string]: any }>> {
    const questions = [];

    for (const q of rawQuestions) {
      const { meta, discoveredMethod } = q;

      const retQ: DistinctQuestion & { index?: number; [key: string]: any } = {};
      for (const key of Object.keys(meta) as Array<keyof typeof meta>) {
        if (typeof meta[key] === 'function') {
          retQ[key] = meta[key].bind(discoveredMethod.parentClass.instance);
        } else {
          retQ[key] = meta[key];
        }
      }
      retQ.filter = discoveredMethod.handler.bind(discoveredMethod.parentClass.instance);
      for (const iKey of Object.keys(
        this.inquirerKeyToMetadataKeyMap,
      ) as Array<InquirerKeysWithPossibleFunctionTypes>) {
        const metas = extraMetas[iKey];
        const iKeyMetaForQuestion = metas.find((extraMeta) => extraMeta.meta.name === meta.name);
        if (iKeyMetaForQuestion) {
          retQ[iKey] = iKeyMetaForQuestion.discoveredMethod.handler.bind(
            iKeyMetaForQuestion.discoveredMethod.parentClass.instance,
          );
        }
      }
      questions.push(retQ);
    }
    return questions;
  }
}
