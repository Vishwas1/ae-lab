
wscat --connect 'wss://testnet.aeternity.io:443/channel?channel_reserve=2&initiator_amount=70000000000000&initiator_id=ak_263V5pB6dw6JnL2KoRhLpomKS6GzdWiwfr9euCU56L5LULkTfa&keep_running=false&lock_period=10&port=13179&protocol=json-rpc&push_amount=1&responder_amount=40000000000000&responder_id=ak_kUYScFPr6rZQMisugGggiNm13LkczJhER5uERERUV1iWNVbpd&role=responder'

{"jsonrpc":"2.0","method":"channels.info","params":{"channel_id":null,"data":{"event":"fsm_up","fsm_id":"ba_ze+ouGQp6nsKrmBe/hWz9NgKv2wQ7G2+6vV3K5zDSPOcMr3b"}},"version":1}


// At this point the responder is listening on address 0.0.0.0 for the initiator's connection on the specified port - 13179

wscat --connect 'wss://testnet.aeternity.io:443/channel?channel_reserve=2&host=localhost&initiator_amount=70000000000000&initiator_id=ak_263V5pB6dw6JnL2KoRhLpomKS6GzdWiwfr9euCU56L5LULkTfa&lock_period=10&port=13179&protocol=json-rpc&push_amount=1&responder_amount=40000000000000&responder_id=ak_kUYScFPr6rZQMisugGggiNm13LkczJhER5uERERUV1iWNVbpd&role=initiator'


{"jsonrpc":"2.0","method":"channels.info","params":{"channel_id":null,"data":{"event":"fsm_up","fsm_id":"ba_5zdP3PEZFGgdQJD0eoHY8d8ts3qHNYgsWu24p/rLMVWZ+lJv"}},"version":1}

