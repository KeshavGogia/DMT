import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";

actor Token{
    var owner : Principal  = Principal.fromText("m3gvd-f5gy5-cyxzx-qgltu-fd7m7-comw2-iasdf-k6mhc-ph4lz-pg5gp-zqe");
    var totalSupply = 1000000000;
    var symbol : Text = "DMT";

    stable var balanceEntry : [(Principal,Nat)] = [];

    private var balance = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
    if(balance.size() < 1)
        {
            balance.put(owner, totalSupply);

        };
    public query func checkBalance(who : Principal) : async Nat {
        let balances : Nat = switch (balance.get(who)){
            case null  0;
            case (?result)  result;
        };
        return balances;
    };
    public query func getSymbol() : async Text{
        return symbol;
    };
    public  shared(msg)  func payOut() : async Text {

    Debug.print(debug_show(msg.caller));
        if(balance.get(msg.caller)==null)
        {
            let amount =10000;
             let result = await transfer(msg.caller ,amount) ;
             return result;
        }else{
            return "Already Claimed"
        }
    
  };

  public shared(msg) func transfer(to:Principal, amount :Nat) : async Text{
    let sendersBalance = await checkBalance(msg.caller);
    if(sendersBalance > amount)
    {
        let newsendersBalance : Nat = sendersBalance - amount;
        balance.put(msg.caller, newsendersBalance);

        let recieversBalance =  await checkBalance(to);
        let newrecieversBalance = recieversBalance + amount;
        balance.put(to,newrecieversBalance);
        return "Success";
    }
    else{
        return "InSufficient Funds";
    }
    };

    system func preupgrade(){
        balanceEntry := Iter.toArray(balance.entries());
    };

    system func postupgrade(){
        balance := HashMap.fromIter<Principal,Nat>(balanceEntry.vals(),1,Principal.equal,Principal.hash);
        if(balance.size() < 1)
        {
            balance.put(owner, totalSupply);

        }
    };

}