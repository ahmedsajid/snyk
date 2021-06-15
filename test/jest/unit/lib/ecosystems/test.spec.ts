import { resolveAndTestFacts } from '../../../../../src/lib/ecosystems/test';
import * as polling from '../../../../../src/lib/ecosystems/polling';
import { Options } from '../../../../../src/lib/types';
describe('test ecosystems', () => {
  afterEach(() => jest.restoreAllMocks());

  it('resolveAndTestFacts', async () => {
    /* eslint-disable @typescript-eslint/camelcase */
    const scanResults = {
      path: [
        {
          name: 'my-unmanaged-c-project',
          facts: [
            {
              type: 'fileSignatures',
              data: [
                {
                  path: 'fastlz_example/fastlz.h',
                  hashes_ffm: [
                    {
                      format: 1,
                      data: 'ucMc383nMM/wkFRM4iOo5Q',
                    },
                    {
                      format: 1,
                      data: 'k+DxEmslFQWuJsZFXvSoYw',
                    },
                  ],
                },
              ],
            },
          ],
          identity: {
            type: 'cpp',
          },
          target: {
            remoteUrl: 'https://github.com/some-org/some-unmanaged-project.git',
            branch: 'master',
          },
        },
      ],
    };

    // temporary values, we trully want depGraph & issuesData/affectedPkgs
    const pollingWithTokenUntilDoneSpy = jest.spyOn(
      polling,
      'pollingWithTokenUntilDone',
    );

    pollingWithTokenUntilDoneSpy.mockResolvedValueOnce({
      components: [
        {
          artifact: 'FastLZ',
          version: '0.5.0',
          author: 'ariya',
          path: 'fastlz_example',
          id: '4f93fa8bd776f26b12f7e4af00000000',
          url: 'https://github.com/ariya/FastLZ/archive/0.5.0.zip',
          cves: {},
          score: 0.5,
        },
      ],
      id: '0e902113-5233-48a9-99be-242cb7c5eda8',
      name: 'fastlz_example',
      startTime: 1623688339451,
      endTime: 1623688340595,
      runTime: 1144,
    });

    const [testResults, errors] = await resolveAndTestFacts(
      'cpp',
      scanResults,
      {} as Options,
    );

    expect(testResults).toEqual([
      {
        components: [
          {
            artifact: 'FastLZ',
            version: '0.5.0',
            author: 'ariya',
            path: 'fastlz_example',
            id: '4f93fa8bd776f26b12f7e4af00000000',
            url: 'https://github.com/ariya/FastLZ/archive/0.5.0.zip',
            cves: {},
            score: 0.5,
          },
        ],
        id: '0e902113-5233-48a9-99be-242cb7c5eda8',
        name: 'fastlz_example',
        startTime: 1623688339451,
        endTime: 1623688340595,
        runTime: 1144,
      },
    ]);
    expect(errors).toEqual([]);
  });
});
