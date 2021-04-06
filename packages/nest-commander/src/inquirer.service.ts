import { DiscoveredMethodWithMeta, DiscoveryService } from '@golevelup/nestjs-discovery';
import { Inject, Injectable } from '@nestjs/common';
import type { DistinctQuestion, Inquirer as InquirerType } from 'inquirer';
import { QuestionMetadata, QuestionNameMetadata } from './command-runner.interface';
import {
  Inquirer,
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

  private readonly inquirerKeyToMetadataKeyMap: {
    transformer: string;
    when: string;
    validate: string;
    [key: string]: string;
  } = {
    transformer: TransformMeta,
    when: WhenMeta,
    validate: ValidateMeta,
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
    for (const iKey of Object.keys(this.inquirerKeyToMetadataKeyMap)) {
      const metaKey = this.inquirerKeyToMetadataKeyMap[iKey];
      const foundMeta = await this.discoveryService.providerMethodsWithMetaAtKey<QuestionNameMetadata>(
        metaKey,
        (found) => found.name === rawQuestions[0].discoveredMethod.parentClass.name,
      );
      extraMetas[iKey] = foundMeta ?? [];
    }

    const questions: Array<DistinctQuestion & { index?: number }> = [];
    for (const q of rawQuestions) {
      const { meta, discoveredMethod } = q;

      const retQ: DistinctQuestion & { index?: number; [key: string]: any } = {
        ...meta,
        filter: discoveredMethod.handler.bind(discoveredMethod.parentClass.instance),
      };
      for (const iKey of Object.keys(this.inquirerKeyToMetadataKeyMap)) {
        const metas = extraMetas[iKey];
        const iKeyMetaForQuestion = metas.find((extraMeta) => extraMeta.meta.name === meta.name);
        if (iKeyMetaForQuestion) {
          retQ[iKey as any] = iKeyMetaForQuestion.discoveredMethod.handler.bind(
            iKeyMetaForQuestion.discoveredMethod.parentClass.instance,
          );
        }
      }
      questions.push(retQ);
    }
    return questions.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  }
}
