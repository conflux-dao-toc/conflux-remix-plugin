使用Remix玩转Conflux上的智能合约
===

Conflux作为中国公链技术的代表，已经在区块链开发者社区中崭露头角。因为Conflux采用了业界流行的合约引擎evm 和 solidity。这样以太坊社区之前积累的智能合约可以直接移植到Conflux公链上。

1. Remix是何物
---
Remix是以太坊社区开发者最常使用的合约开发环境，历史久，打开浏览器就可以直接上手，得到广大区块链爱好者的喜爱。别扯那么多，先要了解地址：

https://remix.ethereum.org/

点开就用。基本上目前所有的区块链开发者都是用它来学习入门solidity开发的。

2. Conflux-portal
---
为了能和Conflux公链进行合约创建、调用等操作交互，我们必须要有一个入口。这个【入口】在区块链开发者口中经常被称为【钱包】。这个【钱包】不仅仅能存币，它其实还是公链编程交互的一个入口，通过它我们可以随时和Conflux公链上的程序：智能合约进行交互，投个票阿，转个币阿，都可以。当前在以太坊上部署个合约都是需要支付几百美刀的，这个成本一直居高不下。做为新型公链代表，Conflux公链解决了合约部署燃料费太贵的问题，提供了在合约部署中极小的燃料费损耗。所以当前在Conflux上部署合约是目前最便宜的渠道之一，这个特性让开发者可以专心编写合约、部署合约而不用担心合约成本。还犹豫啥，记住Conflux钱包门户地址：

https://portal.conflux-chain.org/


## 3. Conlfux-remix-plugin
为了广大区块链开发者的便利，现提供Conflux remix插件，直接支持在线开发。请认准地址：

https://conflux.xuanwugate.com

安装步骤截图如下：
![gudie demo](./plugin1.png)

调用合约的方法和以太坊保持一致，几乎没有额外的学习成本。小伙伴还犹豫啥，撸起袖子开发在线开发Conflux下一代智能合约吧

![gudie demo](./plugin2.png)



## 4. 本地使用conflux-remix插件步骤

为了在本地试用conflux-remix-plugin，需要以下步骤：

### 4.1 安装remix-project

```bash
npm install -g @nrwl/cli

git clone https://github.com/ethereum/remix-project.git

cd remix-project
npm install
nx build remix-ide --with-deps
nx serve  #启动remix server
```

打开浏览器访问：http://127.0.0.1:8080 就可以看到remix工作台

### 4.2 安装conflux-remix-plugin

```bash
git clone https://github.com/conflux-dao-toc/conflux-remix-plugin.git
cd conflux-remix-plugin
yarn start
```

插件启动后地址为[http://localhost:3000](http://localhost:3000/) 

然后参考截图配置上就用上conflux插件了。![plugin-install](./plugin1.png)

