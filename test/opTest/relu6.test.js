import Graph from '../../src/graph/graph';
import GraphExecutor from '../../src/executor/executor';
import opInfo from '../../test/data/model.test.relu6.json';
import Utils from '../../src/utils/utils';
import {webgl} from './common';
import {nchwShape2nhwcShape, getOutputShape, deepCopy} from './common/utils';

const modelType = 'relu6';
const output = deepCopy(opInfo);

const op = opInfo.ops[0];
const graphExecutor = new GraphExecutor(op);
const graph = new Graph({
    options: {
        test: true,
        gl: webgl
    }
});
graph.data = opInfo;
graph.buildOpData(graphExecutor);

async function run() {
    graph.execute_(graphExecutor);
    let result = await graph.inst.read();
    // 获取 NHWC -> NCHW 的 输出
    const outputNCHWShape = getOutputShape(output, modelType);
    const outputNHWCShape = nchwShape2nhwcShape(outputNCHWShape);

    let nchwResult = Utils.nhwc2nchw(result, outputNHWCShape);
    const formatData = Utils.formatReadData(nchwResult, outputNCHWShape);
    const expectd = [
        0.0,
        6.0,
        0.7541497945785522,
        0.35911399126052856,
        0.0,
        0.0,
        0.0,
        0.5168685913085938,
        0.9540461301803589,
        0.9214242696762085
    ];
    expect(JSON.stringify(formatData)).toBe(JSON.stringify(expectd));

}

test('test op relu6 ==============>', async () => {
    await run();
});
