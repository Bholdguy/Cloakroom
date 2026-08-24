/**
 * Privacy Pool Contract ABI
 *
 * This file is auto-generated from Cairo build artifacts.
 * Do not edit manually - run 'npm run generate:abi' to regenerate.
 *
 * The 'as const' assertion enables TypeScript to infer exact literal types,
 * which allows starknet.js's .typedv2() to provide full autocomplete
 * and type checking for contract methods.
 */
export declare const PrivacyPoolABI: readonly [{
    readonly type: "impl";
    readonly name: "ClientImpl";
    readonly interface_name: "privacy::interface::IClient";
}, {
    readonly type: "struct";
    readonly name: "core::array::Span::<core::felt252>";
    readonly members: readonly [{
        readonly name: "snapshot";
        readonly type: "@core::array::Array::<core::felt252>";
    }];
}, {
    readonly type: "struct";
    readonly name: "core::starknet::account::Call";
    readonly members: readonly [{
        readonly name: "to";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "selector";
        readonly type: "core::felt252";
    }, {
        readonly name: "calldata";
        readonly type: "core::array::Span::<core::felt252>";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::SetViewingKeyInput";
    readonly members: readonly [{
        readonly name: "random";
        readonly type: "core::felt252";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::OpenChannelInput";
    readonly members: readonly [{
        readonly name: "recipient_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "index";
        readonly type: "core::integer::u32";
    }, {
        readonly name: "random";
        readonly type: "core::felt252";
    }, {
        readonly name: "salt";
        readonly type: "core::felt252";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::OpenSubchannelInput";
    readonly members: readonly [{
        readonly name: "recipient_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "recipient_public_key";
        readonly type: "core::felt252";
    }, {
        readonly name: "channel_key";
        readonly type: "core::felt252";
    }, {
        readonly name: "index";
        readonly type: "core::integer::u32";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "salt";
        readonly type: "core::felt252";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::CreateEncNoteInput";
    readonly members: readonly [{
        readonly name: "recipient_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "recipient_public_key";
        readonly type: "core::felt252";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "amount";
        readonly type: "core::integer::u128";
    }, {
        readonly name: "index";
        readonly type: "core::integer::u32";
    }, {
        readonly name: "salt";
        readonly type: "core::integer::u128";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::CreateOpenNoteInput";
    readonly members: readonly [{
        readonly name: "recipient_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "recipient_public_key";
        readonly type: "core::felt252";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "index";
        readonly type: "core::integer::u32";
    }, {
        readonly name: "random";
        readonly type: "core::felt252";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::DepositInput";
    readonly members: readonly [{
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "amount";
        readonly type: "core::integer::u128";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::UseNoteInput";
    readonly members: readonly [{
        readonly name: "channel_key";
        readonly type: "core::felt252";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "index";
        readonly type: "core::integer::u32";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::WithdrawInput";
    readonly members: readonly [{
        readonly name: "to_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "amount";
        readonly type: "core::integer::u128";
    }, {
        readonly name: "random";
        readonly type: "core::felt252";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::InvokeExternalInput";
    readonly members: readonly [{
        readonly name: "contract_address";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "calldata";
        readonly type: "core::array::Span::<core::felt252>";
    }];
}, {
    readonly type: "enum";
    readonly name: "privacy::actions::ClientAction";
    readonly variants: readonly [{
        readonly name: "SetViewingKey";
        readonly type: "privacy::actions::SetViewingKeyInput";
    }, {
        readonly name: "OpenChannel";
        readonly type: "privacy::actions::OpenChannelInput";
    }, {
        readonly name: "OpenSubchannel";
        readonly type: "privacy::actions::OpenSubchannelInput";
    }, {
        readonly name: "CreateEncNote";
        readonly type: "privacy::actions::CreateEncNoteInput";
    }, {
        readonly name: "CreateOpenNote";
        readonly type: "privacy::actions::CreateOpenNoteInput";
    }, {
        readonly name: "Deposit";
        readonly type: "privacy::actions::DepositInput";
    }, {
        readonly name: "UseNote";
        readonly type: "privacy::actions::UseNoteInput";
    }, {
        readonly name: "Withdraw";
        readonly type: "privacy::actions::WithdrawInput";
    }, {
        readonly name: "InvokeExternal";
        readonly type: "privacy::actions::InvokeExternalInput";
    }];
}, {
    readonly type: "struct";
    readonly name: "core::array::Span::<privacy::actions::ClientAction>";
    readonly members: readonly [{
        readonly name: "snapshot";
        readonly type: "@core::array::Array::<privacy::actions::ClientAction>";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::WriteOnceInput";
    readonly members: readonly [{
        readonly name: "storage_address";
        readonly type: "core::felt252";
    }, {
        readonly name: "value";
        readonly type: "core::array::Span::<core::felt252>";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::objects::EncChannelInfo";
    readonly members: readonly [{
        readonly name: "ephemeral_pubkey";
        readonly type: "core::felt252";
    }, {
        readonly name: "enc_channel_key";
        readonly type: "core::felt252";
    }, {
        readonly name: "enc_sender_addr";
        readonly type: "core::felt252";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::AppendInput";
    readonly members: readonly [{
        readonly name: "recipient_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "enc_channel_info";
        readonly type: "privacy::objects::EncChannelInfo";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::TransferFromInput";
    readonly members: readonly [{
        readonly name: "from_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "amount";
        readonly type: "core::integer::u128";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::TransferToInput";
    readonly members: readonly [{
        readonly name: "to_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "amount";
        readonly type: "core::integer::u128";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::objects::EncPrivateKey";
    readonly members: readonly [{
        readonly name: "auditor_public_key";
        readonly type: "core::felt252";
    }, {
        readonly name: "ephemeral_pubkey";
        readonly type: "core::felt252";
    }, {
        readonly name: "enc_private_key";
        readonly type: "core::felt252";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::events::ViewingKeySet";
    readonly members: readonly [{
        readonly name: "user_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "public_key";
        readonly type: "core::felt252";
    }, {
        readonly name: "enc_private_key";
        readonly type: "privacy::objects::EncPrivateKey";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::objects::EncUserAddr";
    readonly members: readonly [{
        readonly name: "auditor_public_key";
        readonly type: "core::felt252";
    }, {
        readonly name: "ephemeral_pubkey";
        readonly type: "core::felt252";
    }, {
        readonly name: "enc_user_addr";
        readonly type: "core::felt252";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::events::Withdrawal";
    readonly members: readonly [{
        readonly name: "enc_user_addr";
        readonly type: "privacy::objects::EncUserAddr";
    }, {
        readonly name: "to_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "amount";
        readonly type: "core::integer::u128";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::events::Deposit";
    readonly members: readonly [{
        readonly name: "user_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "amount";
        readonly type: "core::integer::u128";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::events::OpenNoteCreated";
    readonly members: readonly [{
        readonly name: "enc_recipient_addr";
        readonly type: "privacy::objects::EncUserAddr";
    }, {
        readonly name: "depositor";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "note_id";
        readonly type: "core::felt252";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::events::NoteUsed";
    readonly members: readonly [{
        readonly name: "nullifier";
        readonly type: "core::felt252";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::actions::InvokeInput";
    readonly members: readonly [{
        readonly name: "contract_address";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "calldata";
        readonly type: "core::array::Span::<core::felt252>";
    }];
}, {
    readonly type: "enum";
    readonly name: "privacy::actions::ServerAction";
    readonly variants: readonly [{
        readonly name: "WriteOnce";
        readonly type: "privacy::actions::WriteOnceInput";
    }, {
        readonly name: "Append";
        readonly type: "privacy::actions::AppendInput";
    }, {
        readonly name: "TransferFrom";
        readonly type: "privacy::actions::TransferFromInput";
    }, {
        readonly name: "TransferTo";
        readonly type: "privacy::actions::TransferToInput";
    }, {
        readonly name: "EmitViewingKeySet";
        readonly type: "privacy::events::ViewingKeySet";
    }, {
        readonly name: "EmitWithdrawal";
        readonly type: "privacy::events::Withdrawal";
    }, {
        readonly name: "EmitDeposit";
        readonly type: "privacy::events::Deposit";
    }, {
        readonly name: "EmitOpenNoteCreated";
        readonly type: "privacy::events::OpenNoteCreated";
    }, {
        readonly name: "EmitNoteUsed";
        readonly type: "privacy::events::NoteUsed";
    }, {
        readonly name: "Invoke";
        readonly type: "privacy::actions::InvokeInput";
    }];
}, {
    readonly type: "struct";
    readonly name: "core::array::Span::<privacy::actions::ServerAction>";
    readonly members: readonly [{
        readonly name: "snapshot";
        readonly type: "@core::array::Array::<privacy::actions::ServerAction>";
    }];
}, {
    readonly type: "interface";
    readonly name: "privacy::interface::IClient";
    readonly items: readonly [{
        readonly type: "function";
        readonly name: "__execute__";
        readonly inputs: readonly [{
            readonly name: "calls";
            readonly type: "core::array::Array::<core::starknet::account::Call>";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "compile_and_panic";
        readonly inputs: readonly [{
            readonly name: "user_addr";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }, {
            readonly name: "user_private_key";
            readonly type: "core::felt252";
        }, {
            readonly name: "client_actions";
            readonly type: "core::array::Span::<privacy::actions::ClientAction>";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "compile_actions";
        readonly inputs: readonly [{
            readonly name: "user_addr";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }, {
            readonly name: "user_private_key";
            readonly type: "core::felt252";
        }, {
            readonly name: "client_actions";
            readonly type: "core::array::Span::<privacy::actions::ClientAction>";
        }];
        readonly outputs: readonly [{
            readonly type: "core::array::Span::<privacy::actions::ServerAction>";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "__validate__";
        readonly inputs: readonly [{
            readonly name: "calls";
            readonly type: "core::array::Array::<core::starknet::account::Call>";
        }];
        readonly outputs: readonly [{
            readonly type: "core::felt252";
        }];
        readonly state_mutability: "view";
    }];
}, {
    readonly type: "impl";
    readonly name: "ServerImpl";
    readonly interface_name: "privacy::interface::IServer";
}, {
    readonly type: "interface";
    readonly name: "privacy::interface::IServer";
    readonly items: readonly [{
        readonly type: "function";
        readonly name: "apply_actions";
        readonly inputs: readonly [{
            readonly name: "actions";
            readonly type: "core::array::Span::<privacy::actions::ServerAction>";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "deposit_to_open_note";
        readonly inputs: readonly [{
            readonly name: "note_id";
            readonly type: "core::felt252";
        }, {
            readonly name: "token";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }, {
            readonly name: "amount";
            readonly type: "core::integer::u128";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }];
}, {
    readonly type: "impl";
    readonly name: "ViewsImpl";
    readonly interface_name: "privacy::interface::IViews";
}, {
    readonly type: "enum";
    readonly name: "core::bool";
    readonly variants: readonly [{
        readonly name: "False";
        readonly type: "()";
    }, {
        readonly name: "True";
        readonly type: "()";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::objects::EncSubchannelInfo";
    readonly members: readonly [{
        readonly name: "salt";
        readonly type: "core::felt252";
    }, {
        readonly name: "enc_token";
        readonly type: "core::felt252";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::objects::EncOutgoingChannelInfo";
    readonly members: readonly [{
        readonly name: "salt";
        readonly type: "core::felt252";
    }, {
        readonly name: "enc_recipient_addr";
        readonly type: "core::felt252";
    }];
}, {
    readonly type: "struct";
    readonly name: "privacy::objects::Note";
    readonly members: readonly [{
        readonly name: "packed_value";
        readonly type: "core::felt252";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }];
}, {
    readonly type: "interface";
    readonly name: "privacy::interface::IViews";
    readonly items: readonly [{
        readonly type: "function";
        readonly name: "channel_exists";
        readonly inputs: readonly [{
            readonly name: "channel_marker";
            readonly type: "core::felt252";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "get_num_of_channels";
        readonly inputs: readonly [{
            readonly name: "recipient_addr";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "core::integer::u64";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "get_channel_info";
        readonly inputs: readonly [{
            readonly name: "recipient_addr";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }, {
            readonly name: "channel_index";
            readonly type: "core::integer::u64";
        }];
        readonly outputs: readonly [{
            readonly type: "privacy::objects::EncChannelInfo";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "subchannel_exists";
        readonly inputs: readonly [{
            readonly name: "subchannel_marker";
            readonly type: "core::felt252";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "get_subchannel_info";
        readonly inputs: readonly [{
            readonly name: "subchannel_id";
            readonly type: "core::felt252";
        }];
        readonly outputs: readonly [{
            readonly type: "privacy::objects::EncSubchannelInfo";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "get_outgoing_channel_info";
        readonly inputs: readonly [{
            readonly name: "outgoing_channel_id";
            readonly type: "core::felt252";
        }];
        readonly outputs: readonly [{
            readonly type: "privacy::objects::EncOutgoingChannelInfo";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "get_note";
        readonly inputs: readonly [{
            readonly name: "note_id";
            readonly type: "core::felt252";
        }];
        readonly outputs: readonly [{
            readonly type: "privacy::objects::Note";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "nullifier_exists";
        readonly inputs: readonly [{
            readonly name: "nullifier";
            readonly type: "core::felt252";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "get_public_key";
        readonly inputs: readonly [{
            readonly name: "user_addr";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "core::felt252";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "get_enc_private_key";
        readonly inputs: readonly [{
            readonly name: "user_addr";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "privacy::objects::EncPrivateKey";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "get_auditor_public_key";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly type: "core::felt252";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "get_fee_amount";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly type: "core::integer::u128";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "get_fee_collector";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "get_proof_validity_blocks";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly type: "core::integer::u64";
        }];
        readonly state_mutability: "view";
    }];
}, {
    readonly type: "impl";
    readonly name: "AdminImpl";
    readonly interface_name: "privacy::interface::IAdmin";
}, {
    readonly type: "interface";
    readonly name: "privacy::interface::IAdmin";
    readonly items: readonly [{
        readonly type: "function";
        readonly name: "set_auditor_public_key";
        readonly inputs: readonly [{
            readonly name: "auditor_public_key";
            readonly type: "core::felt252";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "set_fee_amount";
        readonly inputs: readonly [{
            readonly name: "fee_amount";
            readonly type: "core::integer::u128";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "set_fee_collector";
        readonly inputs: readonly [{
            readonly name: "fee_collector";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "set_proof_validity_blocks";
        readonly inputs: readonly [{
            readonly name: "proof_validity_blocks";
            readonly type: "core::integer::u64";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }];
}, {
    readonly type: "impl";
    readonly name: "PausableImpl";
    readonly interface_name: "starkware_utils::components::pausable::interface::IPausable";
}, {
    readonly type: "interface";
    readonly name: "starkware_utils::components::pausable::interface::IPausable";
    readonly items: readonly [{
        readonly type: "function";
        readonly name: "is_paused";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "pause";
        readonly inputs: readonly [];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "unpause";
        readonly inputs: readonly [];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }];
}, {
    readonly type: "impl";
    readonly name: "ReplaceabilityImpl";
    readonly interface_name: "starkware_utils::components::replaceability::interface::IReplaceable";
}, {
    readonly type: "struct";
    readonly name: "starkware_utils::components::replaceability::interface::EICData";
    readonly members: readonly [{
        readonly name: "eic_hash";
        readonly type: "core::starknet::class_hash::ClassHash";
    }, {
        readonly name: "eic_init_data";
        readonly type: "core::array::Span::<core::felt252>";
    }];
}, {
    readonly type: "enum";
    readonly name: "core::option::Option::<starkware_utils::components::replaceability::interface::EICData>";
    readonly variants: readonly [{
        readonly name: "Some";
        readonly type: "starkware_utils::components::replaceability::interface::EICData";
    }, {
        readonly name: "None";
        readonly type: "()";
    }];
}, {
    readonly type: "struct";
    readonly name: "starkware_utils::components::replaceability::interface::ImplementationData";
    readonly members: readonly [{
        readonly name: "impl_hash";
        readonly type: "core::starknet::class_hash::ClassHash";
    }, {
        readonly name: "eic_data";
        readonly type: "core::option::Option::<starkware_utils::components::replaceability::interface::EICData>";
    }, {
        readonly name: "final";
        readonly type: "core::bool";
    }];
}, {
    readonly type: "interface";
    readonly name: "starkware_utils::components::replaceability::interface::IReplaceable";
    readonly items: readonly [{
        readonly type: "function";
        readonly name: "get_upgrade_delay";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly type: "core::integer::u64";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "get_impl_activation_time";
        readonly inputs: readonly [{
            readonly name: "implementation_data";
            readonly type: "starkware_utils::components::replaceability::interface::ImplementationData";
        }];
        readonly outputs: readonly [{
            readonly type: "core::integer::u64";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "add_new_implementation";
        readonly inputs: readonly [{
            readonly name: "implementation_data";
            readonly type: "starkware_utils::components::replaceability::interface::ImplementationData";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "remove_implementation";
        readonly inputs: readonly [{
            readonly name: "implementation_data";
            readonly type: "starkware_utils::components::replaceability::interface::ImplementationData";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "replace_to";
        readonly inputs: readonly [{
            readonly name: "implementation_data";
            readonly type: "starkware_utils::components::replaceability::interface::ImplementationData";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }];
}, {
    readonly type: "impl";
    readonly name: "RolesImpl";
    readonly interface_name: "starkware_utils::components::roles::interface::IRoles";
}, {
    readonly type: "struct";
    readonly name: "core::array::Span::<core::starknet::contract_address::ContractAddress>";
    readonly members: readonly [{
        readonly name: "snapshot";
        readonly type: "@core::array::Array::<core::starknet::contract_address::ContractAddress>";
    }];
}, {
    readonly type: "interface";
    readonly name: "starkware_utils::components::roles::interface::IRoles";
    readonly items: readonly [{
        readonly type: "function";
        readonly name: "is_app_governor";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "is_app_role_admin";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "is_governance_admin";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "is_operator";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "is_token_admin";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "is_upgrade_agent";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "is_upgrade_governor";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "is_security_admin";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "is_security_agent";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "is_security_governor";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [{
            readonly type: "core::bool";
        }];
        readonly state_mutability: "view";
    }, {
        readonly type: "function";
        readonly name: "register_app_governor";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "remove_app_governor";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "register_app_role_admin";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "remove_app_role_admin";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "register_governance_admin";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "remove_governance_admin";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "register_operator";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "remove_operator";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "register_token_admin";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "remove_token_admin";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "register_upgrade_agent";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "remove_upgrade_agent";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "register_upgrade_governor";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "remove_upgrade_governor";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "renounce";
        readonly inputs: readonly [{
            readonly name: "role";
            readonly type: "core::felt252";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "register_security_admin";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "remove_security_admin";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "register_security_agent";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "remove_security_agent";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "register_security_governor";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "remove_security_governor";
        readonly inputs: readonly [{
            readonly name: "account";
            readonly type: "core::starknet::contract_address::ContractAddress";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "reclaim_legacy_roles";
        readonly inputs: readonly [];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "reclaim_legacy_roles_for_accounts";
        readonly inputs: readonly [{
            readonly name: "accounts";
            readonly type: "core::array::Span::<core::starknet::contract_address::ContractAddress>";
        }];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }, {
        readonly type: "function";
        readonly name: "disable_legacy_role_reclaim";
        readonly inputs: readonly [];
        readonly outputs: readonly [];
        readonly state_mutability: "external";
    }];
}, {
    readonly type: "constructor";
    readonly name: "constructor";
    readonly inputs: readonly [{
        readonly name: "governance_admin";
        readonly type: "core::starknet::contract_address::ContractAddress";
    }, {
        readonly name: "auditor_public_key";
        readonly type: "core::felt252";
    }, {
        readonly name: "proof_validity_blocks";
        readonly type: "core::integer::u64";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::pausable::pausable::PausableComponent::Paused";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::pausable::pausable::PausableComponent::Unpaused";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::pausable::pausable::PausableComponent::Event";
    readonly kind: "enum";
    readonly variants: readonly [{
        readonly name: "Paused";
        readonly type: "starkware_utils::components::pausable::pausable::PausableComponent::Paused";
        readonly kind: "nested";
    }, {
        readonly name: "Unpaused";
        readonly type: "starkware_utils::components::pausable::pausable::PausableComponent::Unpaused";
        readonly kind: "nested";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::replaceability::interface::ImplementationAdded";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "implementation_data";
        readonly type: "starkware_utils::components::replaceability::interface::ImplementationData";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::replaceability::interface::ImplementationRemoved";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "implementation_data";
        readonly type: "starkware_utils::components::replaceability::interface::ImplementationData";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::replaceability::interface::ImplementationReplaced";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "implementation_data";
        readonly type: "starkware_utils::components::replaceability::interface::ImplementationData";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::replaceability::interface::ImplementationFinalized";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "impl_hash";
        readonly type: "core::starknet::class_hash::ClassHash";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::replaceability::replaceability::ReplaceabilityComponent::Event";
    readonly kind: "enum";
    readonly variants: readonly [{
        readonly name: "ImplementationAdded";
        readonly type: "starkware_utils::components::replaceability::interface::ImplementationAdded";
        readonly kind: "nested";
    }, {
        readonly name: "ImplementationRemoved";
        readonly type: "starkware_utils::components::replaceability::interface::ImplementationRemoved";
        readonly kind: "nested";
    }, {
        readonly name: "ImplementationReplaced";
        readonly type: "starkware_utils::components::replaceability::interface::ImplementationReplaced";
        readonly kind: "nested";
    }, {
        readonly name: "ImplementationFinalized";
        readonly type: "starkware_utils::components::replaceability::interface::ImplementationFinalized";
        readonly kind: "nested";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::AppGovernorAdded";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "added_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "added_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::AppGovernorRemoved";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "removed_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "removed_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::AppRoleAdminAdded";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "added_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "added_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::AppRoleAdminRemoved";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "removed_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "removed_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::GovernanceAdminAdded";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "added_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "added_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::GovernanceAdminRemoved";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "removed_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "removed_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::OperatorAdded";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "added_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "added_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::OperatorRemoved";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "removed_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "removed_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::SecurityAdminAdded";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "added_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "added_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::SecurityAdminRemoved";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "removed_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "removed_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::SecurityAgentAdded";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "added_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "added_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::SecurityAgentRemoved";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "removed_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "removed_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::SecurityGovernorAdded";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "added_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "added_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::SecurityGovernorRemoved";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "removed_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "removed_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::TokenAdminAdded";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "added_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "added_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::TokenAdminRemoved";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "removed_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "removed_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::UpgradeGovernorAdded";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "added_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "added_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::UpgradeGovernorRemoved";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "removed_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "removed_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::UpgradeAgentAdded";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "added_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "added_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::interface::UpgradeAgentRemoved";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "removed_account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "removed_by";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "starkware_utils::components::roles::roles::RolesComponent::Event";
    readonly kind: "enum";
    readonly variants: readonly [{
        readonly name: "AppGovernorAdded";
        readonly type: "starkware_utils::components::roles::interface::AppGovernorAdded";
        readonly kind: "nested";
    }, {
        readonly name: "AppGovernorRemoved";
        readonly type: "starkware_utils::components::roles::interface::AppGovernorRemoved";
        readonly kind: "nested";
    }, {
        readonly name: "AppRoleAdminAdded";
        readonly type: "starkware_utils::components::roles::interface::AppRoleAdminAdded";
        readonly kind: "nested";
    }, {
        readonly name: "AppRoleAdminRemoved";
        readonly type: "starkware_utils::components::roles::interface::AppRoleAdminRemoved";
        readonly kind: "nested";
    }, {
        readonly name: "GovernanceAdminAdded";
        readonly type: "starkware_utils::components::roles::interface::GovernanceAdminAdded";
        readonly kind: "nested";
    }, {
        readonly name: "GovernanceAdminRemoved";
        readonly type: "starkware_utils::components::roles::interface::GovernanceAdminRemoved";
        readonly kind: "nested";
    }, {
        readonly name: "OperatorAdded";
        readonly type: "starkware_utils::components::roles::interface::OperatorAdded";
        readonly kind: "nested";
    }, {
        readonly name: "OperatorRemoved";
        readonly type: "starkware_utils::components::roles::interface::OperatorRemoved";
        readonly kind: "nested";
    }, {
        readonly name: "SecurityAdminAdded";
        readonly type: "starkware_utils::components::roles::interface::SecurityAdminAdded";
        readonly kind: "nested";
    }, {
        readonly name: "SecurityAdminRemoved";
        readonly type: "starkware_utils::components::roles::interface::SecurityAdminRemoved";
        readonly kind: "nested";
    }, {
        readonly name: "SecurityAgentAdded";
        readonly type: "starkware_utils::components::roles::interface::SecurityAgentAdded";
        readonly kind: "nested";
    }, {
        readonly name: "SecurityAgentRemoved";
        readonly type: "starkware_utils::components::roles::interface::SecurityAgentRemoved";
        readonly kind: "nested";
    }, {
        readonly name: "SecurityGovernorAdded";
        readonly type: "starkware_utils::components::roles::interface::SecurityGovernorAdded";
        readonly kind: "nested";
    }, {
        readonly name: "SecurityGovernorRemoved";
        readonly type: "starkware_utils::components::roles::interface::SecurityGovernorRemoved";
        readonly kind: "nested";
    }, {
        readonly name: "TokenAdminAdded";
        readonly type: "starkware_utils::components::roles::interface::TokenAdminAdded";
        readonly kind: "nested";
    }, {
        readonly name: "TokenAdminRemoved";
        readonly type: "starkware_utils::components::roles::interface::TokenAdminRemoved";
        readonly kind: "nested";
    }, {
        readonly name: "UpgradeGovernorAdded";
        readonly type: "starkware_utils::components::roles::interface::UpgradeGovernorAdded";
        readonly kind: "nested";
    }, {
        readonly name: "UpgradeGovernorRemoved";
        readonly type: "starkware_utils::components::roles::interface::UpgradeGovernorRemoved";
        readonly kind: "nested";
    }, {
        readonly name: "UpgradeAgentAdded";
        readonly type: "starkware_utils::components::roles::interface::UpgradeAgentAdded";
        readonly kind: "nested";
    }, {
        readonly name: "UpgradeAgentRemoved";
        readonly type: "starkware_utils::components::roles::interface::UpgradeAgentRemoved";
        readonly kind: "nested";
    }];
}, {
    readonly type: "event";
    readonly name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "role";
        readonly type: "core::felt252";
        readonly kind: "data";
    }, {
        readonly name: "account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "sender";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGrantedWithDelay";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "role";
        readonly type: "core::felt252";
        readonly kind: "data";
    }, {
        readonly name: "account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "sender";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "delay";
        readonly type: "core::integer::u64";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "role";
        readonly type: "core::felt252";
        readonly kind: "data";
    }, {
        readonly name: "account";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }, {
        readonly name: "sender";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "role";
        readonly type: "core::felt252";
        readonly kind: "data";
    }, {
        readonly name: "previous_admin_role";
        readonly type: "core::felt252";
        readonly kind: "data";
    }, {
        readonly name: "new_admin_role";
        readonly type: "core::felt252";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event";
    readonly kind: "enum";
    readonly variants: readonly [{
        readonly name: "RoleGranted";
        readonly type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted";
        readonly kind: "nested";
    }, {
        readonly name: "RoleGrantedWithDelay";
        readonly type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGrantedWithDelay";
        readonly kind: "nested";
    }, {
        readonly name: "RoleRevoked";
        readonly type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked";
        readonly kind: "nested";
    }, {
        readonly name: "RoleAdminChanged";
        readonly type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged";
        readonly kind: "nested";
    }];
}, {
    readonly type: "event";
    readonly name: "openzeppelin_introspection::src5::SRC5Component::Event";
    readonly kind: "enum";
    readonly variants: readonly [];
}, {
    readonly type: "event";
    readonly name: "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event";
    readonly kind: "enum";
    readonly variants: readonly [];
}, {
    readonly type: "event";
    readonly name: "privacy::events::ViewingKeySet";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "user_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "key";
    }, {
        readonly name: "public_key";
        readonly type: "core::felt252";
        readonly kind: "key";
    }, {
        readonly name: "enc_private_key";
        readonly type: "privacy::objects::EncPrivateKey";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "privacy::events::Withdrawal";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "enc_user_addr";
        readonly type: "privacy::objects::EncUserAddr";
        readonly kind: "data";
    }, {
        readonly name: "to_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "key";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "key";
    }, {
        readonly name: "amount";
        readonly type: "core::integer::u128";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "privacy::events::Deposit";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "user_addr";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "key";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "key";
    }, {
        readonly name: "amount";
        readonly type: "core::integer::u128";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "privacy::events::AuditorPublicKeySet";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "auditor_public_key";
        readonly type: "core::felt252";
        readonly kind: "key";
    }];
}, {
    readonly type: "event";
    readonly name: "privacy::events::OpenNoteCreated";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "enc_recipient_addr";
        readonly type: "privacy::objects::EncUserAddr";
        readonly kind: "data";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "key";
    }, {
        readonly name: "note_id";
        readonly type: "core::felt252";
        readonly kind: "key";
    }];
}, {
    readonly type: "event";
    readonly name: "privacy::events::OpenNoteDeposited";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "depositor";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "key";
    }, {
        readonly name: "token";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "key";
    }, {
        readonly name: "note_id";
        readonly type: "core::felt252";
        readonly kind: "key";
    }, {
        readonly name: "amount";
        readonly type: "core::integer::u128";
        readonly kind: "data";
    }];
}, {
    readonly type: "event";
    readonly name: "privacy::events::NoteUsed";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "nullifier";
        readonly type: "core::felt252";
        readonly kind: "key";
    }];
}, {
    readonly type: "event";
    readonly name: "privacy::events::FeeAmountSet";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "fee_amount";
        readonly type: "core::integer::u128";
        readonly kind: "key";
    }];
}, {
    readonly type: "event";
    readonly name: "privacy::events::FeeCollectorSet";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "fee_collector";
        readonly type: "core::starknet::contract_address::ContractAddress";
        readonly kind: "key";
    }];
}, {
    readonly type: "event";
    readonly name: "privacy::events::ProofValidityBlocksSet";
    readonly kind: "struct";
    readonly members: readonly [{
        readonly name: "proof_validity_blocks";
        readonly type: "core::integer::u64";
        readonly kind: "key";
    }];
}, {
    readonly type: "event";
    readonly name: "privacy::privacy::Privacy::Event";
    readonly kind: "enum";
    readonly variants: readonly [{
        readonly name: "PausableEvent";
        readonly type: "starkware_utils::components::pausable::pausable::PausableComponent::Event";
        readonly kind: "flat";
    }, {
        readonly name: "ReplaceabilityEvent";
        readonly type: "starkware_utils::components::replaceability::replaceability::ReplaceabilityComponent::Event";
        readonly kind: "flat";
    }, {
        readonly name: "RolesEvent";
        readonly type: "starkware_utils::components::roles::roles::RolesComponent::Event";
        readonly kind: "flat";
    }, {
        readonly name: "AccessControlEvent";
        readonly type: "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event";
        readonly kind: "flat";
    }, {
        readonly name: "SRC5Event";
        readonly type: "openzeppelin_introspection::src5::SRC5Component::Event";
        readonly kind: "flat";
    }, {
        readonly name: "ReentrancyGuardEvent";
        readonly type: "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event";
        readonly kind: "flat";
    }, {
        readonly name: "ViewingKeySet";
        readonly type: "privacy::events::ViewingKeySet";
        readonly kind: "nested";
    }, {
        readonly name: "Withdrawal";
        readonly type: "privacy::events::Withdrawal";
        readonly kind: "nested";
    }, {
        readonly name: "Deposit";
        readonly type: "privacy::events::Deposit";
        readonly kind: "nested";
    }, {
        readonly name: "AuditorPublicKeySet";
        readonly type: "privacy::events::AuditorPublicKeySet";
        readonly kind: "nested";
    }, {
        readonly name: "OpenNoteCreated";
        readonly type: "privacy::events::OpenNoteCreated";
        readonly kind: "nested";
    }, {
        readonly name: "OpenNoteDeposited";
        readonly type: "privacy::events::OpenNoteDeposited";
        readonly kind: "nested";
    }, {
        readonly name: "NoteUsed";
        readonly type: "privacy::events::NoteUsed";
        readonly kind: "nested";
    }, {
        readonly name: "FeeAmountSet";
        readonly type: "privacy::events::FeeAmountSet";
        readonly kind: "nested";
    }, {
        readonly name: "FeeCollectorSet";
        readonly type: "privacy::events::FeeCollectorSet";
        readonly kind: "nested";
    }, {
        readonly name: "ProofValidityBlocksSet";
        readonly type: "privacy::events::ProofValidityBlocksSet";
        readonly kind: "nested";
    }];
}];
//# sourceMappingURL=abi.d.ts.map