import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { Fund } from '../wrappers/Fund';
import '@ton-community/test-utils';
import { Company } from '../wrappers/Company';

describe('Fund', () => {
    let blockchain: Blockchain;
    let fund: SandboxContract<Fund>;
    let company: SandboxContract<Company>;
    let deployer: SandboxContract<TreasuryContract>

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        fund = blockchain.openContract(await Fund.fromInit(1n));
        company = blockchain.openContract(await Company.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResultFund = await fund.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        const deployResultCompany = await company.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        

        expect(deployResultFund.transactions).toHaveTransaction({
            from: deployer.address,
            to: fund.address,
            deploy: true,
            success: true,
        });

        expect(deployResultCompany.transactions).toHaveTransaction({
            from: deployer.address,
            to: company.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and fund are ready to use
    });

    it('should get bounced', async () => {
        const res = await fund.send(deployer.getSender(), {
            value: toNano('0.2')
        }, {
            $$type: 'Withdraw',
            amount: 33n,
            target: company.address
        })
        // await sleep(1000)
        const balanceFund = await fund.getBalance()
        const balanceCompany = await company.getBalance()
        // expect(balanceFund).toEqual(7n)
        // expect(balanceCompany).toEqual(3n)
        console.log(res)
    });
});

async function sleep(t: number){
    return new Promise(resolve=>setTimeout(resolve, t))
}