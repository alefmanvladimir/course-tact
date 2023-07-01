import "@stdlib/deploy";

message CounterValue {
    amount: Int as uint32;
}

message Reach {
    counter: Address;
    target: Int as uint32;
}

contract BuilkAdder with Deployable {

    target: Int as uint32;

    init() {
        // require(self.target<=10, "target can't be more than 10");
        self.target = 0;    
    }

    // step 1
    receive(msg: Reach) {
        self.target = msg.target; // 5
        send(SendParameters{
            to: msg.counter,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: "query".asComment()
        });
    }

    // step 3, 5
    receive(msg: CounterValue){
        if(msg.amount<self.target){
            send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: "increment".asComment()
            });
        }
    }
}
