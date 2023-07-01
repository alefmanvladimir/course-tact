import "@stdlib/deploy";

message Deposit{
    amount: Int as uint32;
}

message Withdraw{
    amount: Int as uint32;
    target: Address;
}

contract Fund with Deployable {
    
    id: Int as uint32;
    balance: Int as uint256;

    init(id: Int) {
        self.id = id;
        self.balance = 10;
    }

    receive(){
        throw(123); // no TONcoins
    }

    receive(msg: Withdraw){
        require(self.balance>=msg.amount, "there isn't such balance on contract");
        self.balance = self.balance - msg.amount;
        send(SendParameters{
            to: msg.target,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: Deposit{amount: msg.amount}.toCell()
        });
    }

    receive(msg: Deposit){
        self.balance = self.balance + msg.amount;
    }

    // only 224 usable data bits
    bounced(src: Deposit){
        self.balance = self.balance + src.amount;
    }

    get fun balance(): Int{
        return self.balance;
    }

}
