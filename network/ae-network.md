~/aeternity/node

~/aeternity/node/generated_keys



set path in ~/.bashrc

sudo vi ~/.bashrc
...
export PATH="/home/vishwas/aeternity/node/bin:$PATH"
...


source ~/.bashrc


ak_28BrVUpmcAD1PzXneJMMNP5ia1a9JKrtgYh2zYTZhBfL35SCg6
46a010c941c374b3ee7972665fdf8f3bd02602aaa64135a4de458169af310e7f9403ed8e3450183bba8472ea1f0ff073cb18c490c0a65e71c092327cc853e8d2


mkdir -p ~/aeternity/node/config

AETERNITY_CONFIG=/home/vishwas/aeternity/node/config/aeternity.yaml

```yaml
---
sync:
    port: 3015

keys:
    dir: keys
    peer_password: "aenodepeerpassword"

http:
    external:
        port: 3013
    internal:
        port: 3113

websocket:
    channel:
        port: 3014

mining:
    beneficiary: "ak_28BrVUpmcAD1PzXneJMMNP5ia1a9JKrtgYh2zYTZhBfL35SCg6"
    autostart: true
    beneficiary_reward_delay: 2
    autostart: true
    cuckoo:
        edge_bits: 15
        miners:
            - executable: mean15-generic

chain:
    persist: true
    db_path: ./ae_chain
    db_backend: leveled

fork_management:
    network_id: ae_privatenet

```


## start
AETERNITY_CONFIG=~/aeternity/node/config/aeternity.yaml aeternity start 

## Debug
tail ~/aeternity/node/log/aeternity_mining.log -f
 
## check status
curl http://127.0.0.1:3013/v2/blocks/top


## Check balance

https://testnet.aeternity.io/v2/accounts/ak_2qRZHvkWy1oo1ktgu5kC8yPwtyRsNnx3CSSLH4bRnBS7B8TtfU
http://localhost:3013/v2/transactions/th_2k85uheYPgzpyvXPyjXoWrHetLt6SpYjMFQHTSTRyx3S7sWDrZ

## References

- https://docs.aeternity.io/en/latest/docker/#localnet
- https://github.com/aeternity/aeternity/blob/master/docs/configuration.md#example
- https://github.com/aeternity/localnet/blob/master/node/config/singlenode_mean15.yaml 
- https://github.com/aeternity/localnet/blob/master/docker-compose.yml




http://localhost:3000/api/wallet/fund?publicKey=ak_2hFtTTre3qm2YusnzMTFFsTy2Uz5kTd7b6uj4XqKYrNQQVDTJf

http://localhost:3000/api/wallet/balance?publicKey=ak_2hFtTTre3qm2YusnzMTFFsTy2Uz5kTd7b6uj4XqKYrNQQVDTJf