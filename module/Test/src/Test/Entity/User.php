<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;

/** @ORM\Entity */

class User {

    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string") */
	protected $fullName;

	/** @ORM\Column(type="string") */
	protected $email;
	
	/** @ORM\Column(type="string") */
	protected $domainCredentials;
	
	public function getId(){
	    return $this->id;
	}
	
	public function getFullName(){
	    return $this->fullName;
    }

    public function getEmail(){
    	return $this->email;
    }
    
    public function getdomainCredentials(){
    	return $this->domainCredentials;
    }
    
    public function setId($id){
        $this->id = $id;
    }
    
    public function setFullName($fullName){
        $this->fullName = $fullName;
    }
    
    public function setEmail($email){
    	$this->email = $email;
    }
    
    public function setDomainCredentials($domainCredentials){
    	$this->domainCredentials = $domainCredentials;
    }
}
