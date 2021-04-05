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

  private readonly additionalMetadata = [TransformMeta, WhenMeta, ValidateMeta];

  async ask<T>(questionSetName: string, options: Partial<T> | undefined): Promise<T> {
    const rawQuestions = await this.findQuestionSet(questionSetName);
    const questions = this.mapMetaQuestionToQuestion(rawQuestions);
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

  private mapMetaQuestionToQuestion(
    rawQuestions: DiscoveredMethodWithMeta<QuestionMetadata>[],
  ): ReadonlyArray<DistinctQuestion> {
    // change this to a regular for loop to use `await`
    // loop through questions, get additional metas if they exist
    // and add to the `retQ` meta object, for inquirer to take care of
    // the rest of the calls. Everything else should be managed already
    const questions = rawQuestions
      .map((q) => {
        const { meta, discoveredMethod: methodInfo } = q;
        const retQ = {
          ...meta,
        };
        return retQ;
      })
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    return questions;
  }
}
